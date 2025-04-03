import { useEffect, useRef, useState } from "react";
import { initDraw } from "@/app/draw";
import { Circle, Diamond, Eraser, Minus, Pencil, RectangleHorizontalIcon, ZoomIn, ZoomOut, Move, Undo, Type, SunMoon } from "lucide-react";

type Shape = "circle" | "rect" | "line" | "pencil" | "diamond" | "eraser" | "text";
type Theme = "dark" | "light";

export function Canvas({
    roomId,
    socket
}:{
    roomId : string;
    socket : WebSocket;
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);   
    const [selectedTool, setSelectedTool] = useState<Shape>("circle");
    const [zoom, setZoom] = useState<number>(1);
    const [undoHistory, setUndoHistory] = useState<any[]>([]);
    const [isPanning, setIsPanning] = useState<boolean>(false);
    const drawInstanceRef = useRef<any>(null);
    const [theme, setTheme] = useState<Theme>("dark");

    // Update the window.selectedTool when tool changes
    useEffect(() => {
        //@ts-ignore
        window.selectedTool = selectedTool;
    }, [selectedTool]);

    // Initialize drawing canvas
    useEffect(() => {
        if(canvasRef.current) {
            // Initialize the drawing instance with undo history capability
            const drawInstance = initDraw(canvasRef.current, roomId, socket, {
                onShapeAdded: (shape: any) => {
                    setUndoHistory(prev => [...prev, { type: 'add', shape }]);
                },
                onShapeRemoved: (shapeId: string) => {
                    setUndoHistory(prev => [...prev, { type: 'remove', shapeId }]);
                },
                theme: theme
            });
            
            drawInstanceRef.current = drawInstance;
            
            // Handle window resize
            const handleResize = () => {
                if(canvasRef.current) {
                    canvasRef.current.width = window.innerWidth;
                    canvasRef.current.height = window.innerHeight;
                    // Redraw canvas with existing shapes
                    if(drawInstance && drawInstance.redraw) {
                        drawInstance.redraw();
                    }
                }
            };
            
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
                if(drawInstance && drawInstance.cleanup) {
                    drawInstance.cleanup();
                }
            };
        }
    }, [canvasRef, roomId, socket, theme]);

    // Function to handle zoom in/out
    const handleZoom = (zoomIn: boolean) => {
        // Create a synthetic wheel event to simulate zooming
        if(canvasRef.current) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const centerX = canvasRect.width / 2;
            const centerY = canvasRect.height / 2;
            
            // Create a synthetic wheel event
            const wheelEvent = new WheelEvent('wheel', {
                deltaY: zoomIn ? -100 : 100,  // Negative for zoom in, positive for zoom out
                clientX: canvasRect.left + centerX,
                clientY: canvasRect.top + centerY,
                ctrlKey: true  // Important: The zoom function in initDraw checks for ctrlKey
            });
            
            // Dispatch the event to trigger the zoom logic in initDraw
            canvasRef.current.dispatchEvent(wheelEvent);
            
            // Update local state to reflect the zoom (for the UI indicator)
            // This doesn't directly affect the canvas zoom, but keeps the indicator in sync
            const newZoom = zoomIn ? zoom + 0.1 : Math.max(0.1, zoom - 0.1);
            setZoom(newZoom);
        }
    };

    // Function to handle panning mode toggle
    const togglePanning = () => {
        const newPanningState = !isPanning;
        setIsPanning(newPanningState);
        
        if (drawInstanceRef.current && drawInstanceRef.current.setPanningMode) {
            drawInstanceRef.current.setPanningMode(newPanningState);
        }
    };

    // Function to handle undo
    const handleUndo = () => {
        if (undoHistory.length > 0 && drawInstanceRef.current && drawInstanceRef.current.performUndo) {
            const lastAction = undoHistory[undoHistory.length - 1];
            drawInstanceRef.current.performUndo(lastAction);
            setUndoHistory(prev => prev.slice(0, -1));
        }
    };

    // Function to toggle theme
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        
        if (drawInstanceRef.current && drawInstanceRef.current.setTheme) {
            drawInstanceRef.current.setTheme(newTheme);
        }
    };

    return (
        <div className={`relative h-screen w-full overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
            <canvas 
                ref={canvasRef} 
                width={window.innerWidth} 
                height={window.innerHeight} 
                className="block mx-auto"
                style={{ 
                    cursor: selectedTool === 'eraser' 
                        ? 'cell' 
                        : isPanning 
                            ? 'grab' 
                            : selectedTool === 'text'
                                ? 'text'
                                : 'crosshair' 
                }}
            />
            <Toolbar 
                selectedTool={selectedTool} 
                setSelectedTool={setSelectedTool} 
                zoom={zoom}
                onZoomIn={() => handleZoom(true)}
                onZoomOut={() => handleZoom(false)}
                isPanning={isPanning}
                onTogglePanning={togglePanning}
                canUndo={undoHistory.length > 0}
                onUndo={handleUndo}
                theme={theme}
                onToggleTheme={toggleTheme}
            />
            <ZoomIndicator zoom={zoom} theme={theme} />
        </div>
    );
}

// IconButton component using the enhanced version with tooltips
function IconButton({
    activated,
    icon,
    onClick,
    tooltip,
    disabled = false,
    theme = "dark"
}:{
    activated?: boolean;
    icon: React.ReactNode;
    onClick: () => void;
    tooltip?: string;
    disabled?: boolean;
    theme?: Theme;
}) {
    const getButtonClasses = () => {
        if (activated) {
            return 'bg-blue-500 text-white';
        }
        if (disabled) {
            return theme === 'dark' 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed';
        }
        return theme === 'dark'
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    };

    return (
        <div className="relative group">
            <button
                className={`p-2 rounded-md transition-colors ${getButtonClasses()}`}
                onClick={onClick}
                disabled={disabled}
                aria-label={tooltip}
            >
                {icon}
            </button>
            {tooltip && (
                <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {tooltip}
                </div>
            )}
        </div>
    );
}

function Toolbar({
    selectedTool, 
    setSelectedTool,
    zoom,
    onZoomIn,
    onZoomOut,
    isPanning,
    onTogglePanning,
    canUndo,
    onUndo,
    theme,
    onToggleTheme
}:{
    selectedTool: Shape;
    setSelectedTool: (tool: Shape) => void;
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    isPanning: boolean;
    onTogglePanning: () => void;
    canUndo: boolean;
    onUndo: () => void;
    theme: Theme;
    onToggleTheme: () => void;
}){
    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-2`}>
            <div className="flex gap-1 items-center">
                <div className={`border-r ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} pr-2 mr-2`}>
                    <IconButton 
                        activated={selectedTool === "pencil"} 
                        icon={<Pencil size={20} />} 
                        onClick={() => setSelectedTool("pencil")}
                        tooltip="Pencil (Free Draw)"
                        theme={theme}
                    />
                </div>
                
                <div className={`flex gap-1 border-r ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} pr-2 mr-2`}>
                    <IconButton 
                        activated={selectedTool === "line"} 
                        icon={<Minus size={20} />} 
                        onClick={() => setSelectedTool("line")}
                        tooltip="Line"
                        theme={theme}
                    />
                    <IconButton 
                        activated={selectedTool === "rect"} 
                        icon={<RectangleHorizontalIcon size={20} />} 
                        onClick={() => setSelectedTool("rect")}
                        tooltip="Rectangle"
                        theme={theme}
                    />
                    <IconButton 
                        activated={selectedTool === "circle"} 
                        icon={<Circle size={20} />} 
                        onClick={() => setSelectedTool("circle")}
                        tooltip="Circle"
                        theme={theme}
                    />
                    <IconButton 
                        activated={selectedTool === "diamond"} 
                        icon={<Diamond size={20} />} 
                        onClick={() => setSelectedTool("diamond")}
                        tooltip="Diamond"
                        theme={theme}
                    />
                </div>
                
                <div className={`flex gap-1 border-r ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} pr-2 mr-2`}>
                    <IconButton 
                        activated={selectedTool === "text"} 
                        icon={<Type size={20} />} 
                        onClick={() => setSelectedTool("text")}
                        tooltip="Text"
                        theme={theme}
                    />
                    <IconButton 
                        activated={selectedTool === "eraser"} 
                        icon={<Eraser size={20} />} 
                        onClick={() => setSelectedTool("eraser")}
                        tooltip="Eraser"
                        theme={theme}
                    />
                </div>
                
                <div className={`flex gap-1 border-r ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} pr-2 mr-2`}>
                    <IconButton 
                        icon={<ZoomIn size={20} />} 
                        onClick={onZoomIn}
                        tooltip="Zoom In"
                        theme={theme}
                    />
                    <IconButton 
                        icon={<ZoomOut size={20} />} 
                        onClick={onZoomOut}
                        tooltip="Zoom Out"
                        theme={theme}
                    />
                    <IconButton 
                        activated={isPanning} 
                        icon={<Move size={20} />} 
                        onClick={onTogglePanning}
                        tooltip="Pan Canvas"
                        theme={theme}
                    />
                </div>
            </div>
        </div>
    );
}

function ZoomIndicator({ zoom, theme }: { zoom: number, theme: Theme }) {
    return (
        <div className={`fixed bottom-4 right-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} px-3 py-1 rounded-md text-sm shadow-md`}>
            {Math.round(zoom * 100)}%
        </div>
    );
}