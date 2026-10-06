import { useEffect, useRef, useState } from "react"
import { initDraw } from "@/app/draw"
import Link from "next/link"
import { Shapes } from "lucide-react"
import {
  Pencil, Minus, RectangleHorizontalIcon, Circle, Diamond, Type, Eraser,
  ZoomIn, ZoomOut, Undo, Sun, Moon, Download, Share2,
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

export function Canvas({ roomId, boardName, socket }: { roomId: string; boardName: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<Shape>("pencil")
  const [zoom, setZoom] = useState(1)
  const drawInstanceRef = useRef<any>(null)
  const [theme, setTheme] = useState<Theme>("light")

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

  const toolbarBg = theme === "dark" ? "bg-[#211f2b]/95 border-white/10" : "bg-white/90 border-[#e8e6ed]"
  const canvasBg = theme === "dark" ? "bg-[#111017]" : "bg-[#f7f6fa]"
  const shareBoard = async () => {
    await navigator.clipboard?.writeText(window.location.href)
  }

  return (
    <div className={`relative h-screen w-full overflow-hidden ${canvasBg}`}>
      <canvas
        ref={canvasRef}
        width={typeof window !== "undefined" ? window.innerWidth : 1920}
        height={typeof window !== "undefined" ? window.innerHeight : 1080}
        className="block"
        style={{ cursor }}
      />

      <header className={`fixed left-3 right-3 top-3 z-50 flex h-12 items-center justify-between rounded-2xl border px-3 shadow-[0_10px_35px_-20px_rgba(20,17,32,.4)] backdrop-blur-xl sm:left-6 sm:right-6 sm:top-5 sm:px-5 ${toolbarBg}`}>
        <div className="flex min-w-0 items-center gap-2.5">
          <Link href="/dashboard" aria-label="Back to all boards" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><Shapes className="h-4 w-4" /></Link>
          <span className={`truncate text-xs font-semibold ${theme === "dark" ? "text-white" : "text-[#34313f]"}`}>{boardName}</span>
          <span className={`hidden rounded-md px-2 py-1 text-[10px] sm:inline ${theme === "dark" ? "bg-white/5 text-white/45" : "bg-[#f5f3f8] text-[#898591]"}`}>Collaborative board</span>
        </div>
        <button type="button" onClick={shareBoard} className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-violet-700 px-3 text-[11px] font-semibold text-white transition hover:bg-violet-800"><Share2 size={13} /> Share</button>
      </header>

      <div className={`fixed bottom-4 left-1/2 z-50 w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-x-auto rounded-2xl border shadow-lg backdrop-blur-xl sm:bottom-6 ${toolbarBg}`}>
        <div className="flex items-center gap-1 px-2 py-1.5">
          {toolGroups.map((group, gi) => (
            <div key={group.label} className={`flex items-center gap-0.5 ${gi < toolGroups.length - 1 ? `mr-1 border-r pr-1 sm:mr-2 sm:pr-2 ${theme === "dark" ? "border-white/10" : "border-[#eeebf1]"}` : ""}`}>
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
          <div className={`ml-1 flex items-center gap-0.5 border-l pl-1 sm:ml-2 sm:pl-2 ${theme === "dark" ? "border-white/10" : "border-[#eeebf1]"}`}>
            <ToolButton icon={<ZoomIn size={18} />} label="Zoom in" onClick={() => handleZoom(true)} theme={theme} />
            <ToolButton icon={<ZoomOut size={18} />} label="Zoom out" onClick={() => handleZoom(false)} theme={theme} />
          </div>
          <div className={`ml-1 flex items-center gap-0.5 border-l pl-1 sm:ml-2 sm:pl-2 ${theme === "dark" ? "border-white/10" : "border-[#eeebf1]"}`}>
            <ToolButton icon={<Undo size={18} />} label="Undo"
              onClick={() => drawInstanceRef.current?.performUndo?.()} theme={theme} />
            <ToolButton icon={<Download size={18} />} label="Export PNG"
              onClick={() => drawInstanceRef.current?.exportPNG?.()} theme={theme} />
            <ToolButton icon={theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              label="Toggle theme" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} theme={theme} />
          </div>
        </div>
      </div>

      <div className={`fixed right-4 top-[4.25rem] z-40 flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-[11px] shadow-sm backdrop-blur-md sm:right-6 sm:top-[4.75rem] ${toolbarBg} ${theme === "dark" ? "text-zinc-300" : "text-[#777481]"}`}>
        <ZoomIn className="h-3.5 w-3.5" />
        <span>{Math.round(zoom * 100)}%</span>
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
            ? theme === "dark" ? "bg-violet-500/20 text-violet-200 shadow-sm shadow-violet-500/20" : "bg-violet-100 text-violet-700"
            : theme === "dark"
              ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              : "text-[#817d89] hover:text-violet-700 hover:bg-[#f5f2fa]"
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
      </button>
      <div className={`absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs opacity-0 shadow-md transition-opacity pointer-events-none group-hover:opacity-100 ${theme === "dark" ? "border-white/10 bg-[#2b2935] text-white" : "border-[#ebe9ef] bg-white text-[#514d5a]"}`}>
        {label}
      </div>
    </div>
  )
}
