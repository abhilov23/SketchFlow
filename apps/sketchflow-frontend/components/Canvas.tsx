import { useEffect, useRef, useState } from "react"
import { initDraw } from "@/app/draw"
import {
  Pencil, Minus, RectangleHorizontalIcon, Circle, Diamond, Type, Eraser,
  ZoomIn, ZoomOut, Undo, Sun, Moon, Download,
} from "lucide-react"

type Shape = "circle" | "rect" | "line" | "pencil" | "diamond" | "eraser" | "text"
type Theme = "dark" | "light"

const toolGroups = [
  {
    label: "Draw",
    tools: [
      { id: "pencil" as Shape, icon: <Pencil size={18} />, label: "Pencil" },
    ],
  },
  {
    label: "Shapes",
    tools: [
      { id: "line" as Shape, icon: <Minus size={18} />, label: "Line" },
      { id: "rect" as Shape, icon: <RectangleHorizontalIcon size={18} />, label: "Rectangle" },
      { id: "circle" as Shape, icon: <Circle size={18} />, label: "Circle" },
      { id: "diamond" as Shape, icon: <Diamond size={18} />, label: "Diamond" },
    ],
  },
  {
    label: "Tools",
    tools: [
      { id: "text" as Shape, icon: <Type size={18} />, label: "Text" },
      { id: "eraser" as Shape, icon: <Eraser size={18} />, label: "Eraser" },
    ],
  },
]

export function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<Shape>("circle")
  const [zoom, setZoom] = useState(1)
  const drawInstanceRef = useRef<any>(null)
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    (window as any).selectedTool = selectedTool
  }, [selectedTool])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    initDraw(canvas, roomId, socket, {
      theme,
      onZoomChange: (z) => setZoom(z),
    }).then(instance => {
      if (cancelled) {
        instance?.cleanup?.()
      } else {
        drawInstanceRef.current = instance
      }
    })

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawInstanceRef.current?.redraw?.()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      cancelled = true
      window.removeEventListener("resize", handleResize)
      drawInstanceRef.current?.cleanup?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, roomId, socket])

  useEffect(() => {
    drawInstanceRef.current?.setTheme?.(theme)
  }, [theme])

  const handleZoom = (zoomIn: boolean) => {
    drawInstanceRef.current?.changeZoom?.(zoomIn ? 0.1 : -0.1)
  }

  const cursorMap: Record<string, string> = {
    eraser: "cell",
    text: "text",
  }

  const cursor = cursorMap[selectedTool] || "crosshair"

  const toolbarBg = theme === "dark" ? "bg-zinc-900/95 border-zinc-800" : "bg-white/95 border-zinc-200"
  const canvasBg = theme === "dark" ? "bg-zinc-950" : "bg-zinc-100"

  return (
    <div className={`relative h-screen w-full overflow-hidden ${canvasBg}`}>
      <canvas
        ref={canvasRef}
        width={typeof window !== "undefined" ? window.innerWidth : 1920}
        height={typeof window !== "undefined" ? window.innerHeight : 1080}
        className="block"
        style={{ cursor }}
      />

      {/* Floating toolbar */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-2xl border shadow-2xl backdrop-blur-md ${toolbarBg}`}>
        <div className="flex items-center gap-1 px-2 py-2">
          {toolGroups.map((group, gi) => (
            <div key={group.label} className={`flex items-center gap-0.5 ${gi < toolGroups.length - 1 ? "pr-2 mr-2 border-r border-zinc-700/30" : ""}`}>
              {group.tools.map(t => (
                <ToolButton
                  key={t.id}
                  active={selectedTool === t.id}
                  icon={t.icon}
                  label={t.label}
                  onClick={() => setSelectedTool(t.id)}
                  theme={theme}
                />
              ))}
            </div>
          ))}
          <div className="flex items-center gap-0.5 pl-2 ml-2 border-l border-zinc-700/30">
            <ToolButton icon={<ZoomIn size={18} />} label="Zoom in" onClick={() => handleZoom(true)} theme={theme} />
            <ToolButton icon={<ZoomOut size={18} />} label="Zoom out" onClick={() => handleZoom(false)} theme={theme} />
          </div>
          <div className="flex items-center gap-0.5 pl-2 ml-2 border-l border-zinc-700/30">
            <ToolButton icon={<Undo size={18} />} label="Undo"
              onClick={() => drawInstanceRef.current?.performUndo?.()} theme={theme} />
            <ToolButton icon={<Download size={18} />} label="Export PNG"
              onClick={() => drawInstanceRef.current?.exportPNG?.()} theme={theme} />
            <ToolButton icon={theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              label="Toggle theme" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} theme={theme} />
          </div>
        </div>
      </div>

      {/* Zoom indicator */}
      <div className={`fixed bottom-6 right-6 z-50 rounded-xl border px-3.5 py-2 text-sm font-medium shadow-lg backdrop-blur-md ${toolbarBg}`}>
        <div className="flex items-center gap-2">
          <ZoomIn className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Canvas controls hint */}
      <div className={`fixed bottom-6 left-6 z-50 rounded-xl border px-3.5 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur-md ${toolbarBg}`}>
        <span>Scroll to zoom &middot; Middle-click or Space + drag to pan</span>
      </div>
    </div>
  )
}

function ToolButton({ active, icon, label, onClick, disabled, theme }: {
  active?: boolean; icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; theme: Theme
}) {
  return (
    <div className="relative group">
      <button
        className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm transition-all ${
          disabled ? "opacity-25 cursor-not-allowed" :
          active
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
            : theme === "dark"
              ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200"
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-popover text-popover-foreground border border-border shadow-md z-50">
        {label}
      </div>
    </div>
  )
}
