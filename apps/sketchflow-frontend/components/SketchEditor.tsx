"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type React from "react"
import Link from "next/link"
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChevronDown,
  Circle,
  Hand,
  MousePointer2,
  Redo2,
  RectangleHorizontal,
  Undo2,
  Minus,
  Plus,
  Pen,
  Trash2,
  X,
} from "lucide-react"

type Tool = "move" | "select" | "draw" | "rectangle" | "circle" | "arrow" | "eraser"
type Point = { x: number; y: number }
type DrawItem = {
  id: string
  type: "line" | "rectangle" | "circle" | "arrow"
  x1: number
  y1: number
  x2: number
  y2: number
  points?: Point[]
  color: string
  strokeWidth: number
  dashed: boolean
}
type Style = { color: string; strokeWidth: number; dashed: boolean }

const tools: { id: Tool; label: string; shortcut: string; icon: typeof Hand }[] = [
  { id: "move", label: "Move canvas", shortcut: "H", icon: Hand },
  { id: "select", label: "Select", shortcut: "V", icon: MousePointer2 },
  { id: "draw", label: "Draw", shortcut: "P", icon: Pen },
  { id: "rectangle", label: "Rectangle", shortcut: "R", icon: RectangleHorizontal },
  { id: "circle", label: "Circle", shortcut: "O", icon: Circle },
  { id: "arrow", label: "Arrow", shortcut: "A", icon: ArrowUpRight },
  { id: "eraser", label: "Eraser", shortcut: "E", icon: X },
]

const colors = [
  { name: "Ink", value: "#25263a" },
  { name: "Violet", value: "#7867f5" },
  { name: "Coral", value: "#f07873" },
  { name: "Amber", value: "#e8a83e" },
  { name: "Mint", value: "#59b99a" },
  { name: "Blue", value: "#5c9de8" },
]

const initialStyle: Style = { color: colors[0].value, strokeWidth: 2, dashed: false }

export function SketchEditor({ boardId }: { boardId: string }) {
  const [activeTool, setActiveTool] = useState<Tool>("draw")
  const [items, setItems] = useState<DrawItem[]>([])
  const [draft, setDraft] = useState<DrawItem | null>(null)
  const [past, setPast] = useState<DrawItem[][]>([])
  const [future, setFuture] = useState<DrawItem[][]>([])
  const [style, setStyle] = useState<Style>(initialStyle)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const gestureRef = useRef<{ start: Point; pan: Point } | null>(null)

  const commit = useCallback((next: DrawItem[]) => {
    setPast((history) => [...history, items])
    setItems(next)
    setFuture([])
    setSelectedId(null)
  }, [items])

  const undo = useCallback(() => {
    if (!past.length) return
    setFuture((history) => [items, ...history])
    setItems(past[past.length - 1])
    setPast((history) => history.slice(0, -1))
  }, [items, past])

  const redo = useCallback(() => {
    if (!future.length) return
    setPast((history) => [...history, items])
    setItems(future[0])
    setFuture((history) => history.slice(1))
  }, [future, items])

  const pointFromEvent = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: (event.clientX - bounds.left - pan.x) / zoom, y: (event.clientY - bounds.top - pan.y) / zoom }
  }

  const pointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const point = pointFromEvent(event)
    gestureRef.current = { start: point, pan }

    if (activeTool === "move" || spaceHeld) return
    if (activeTool === "eraser") {
      const hit = [...items].reverse().find((item) => hitTest(item, point))
      if (hit) commit(items.filter((item) => item.id !== hit.id))
      return
    }
    if (activeTool === "select") {
      const hit = [...items].reverse().find((item) => hitTest(item, point))
      setSelectedId(hit?.id ?? null)
      return
    }
    setDraft({
      id: crypto.randomUUID(),
      type: activeTool === "draw" ? "line" : activeTool,
      x1: point.x,
      y1: point.y,
      x2: point.x,
      y2: point.y,
      points: activeTool === "draw" ? [point] : undefined,
      ...style,
    })
  }

  const pointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const gesture = gestureRef.current
    if (!gesture) return
    if (activeTool === "move" || spaceHeld) {
      setPan({ x: gesture.pan.x + event.clientX - (event.currentTarget.getBoundingClientRect().left + gesture.start.x * zoom + gesture.pan.x), y: gesture.pan.y + event.clientY - (event.currentTarget.getBoundingClientRect().top + gesture.start.y * zoom + gesture.pan.y) })
      return
    }
    if (!draft) return
    const point = pointFromEvent(event)
    setDraft((current) => current ? {
      ...current,
      x2: point.x,
      y2: point.y,
      points: current.points ? [...current.points, point] : undefined,
    } : null)
  }

  const pointerUp = () => {
    gestureRef.current = null
    if (!draft) return
    commit([...items, draft])
    setDraft(null)
  }

  const clearCanvas = useCallback(() => {
    if (!items.length) return
    commit([])
  }, [commit, items])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault()
        setSpaceHeld(true)
        return
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
        return
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault()
        clearCanvas()
        return
      }
      const tool = tools.find((entry) => entry.shortcut.toLowerCase() === event.key.toLowerCase())
      if (tool) setActiveTool(tool.id)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") setSpaceHeld(false)
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [clearCanvas, future, items, past, redo, undo])

  const exportSvg = () => {
    if (!svgRef.current) return
    const source = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "sketchflow-board.svg"
    link.click()
    URL.revokeObjectURL(url)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <main className="relative h-dvh min-h-[520px] overflow-hidden bg-[#f6f7fb] text-[#28283b]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#d8dbe7_0.8px,transparent_0.9px)] [background-size:24px_24px]" />

      <header className="absolute left-4 right-4 top-4 z-20 flex h-[58px] items-center justify-between rounded-2xl border border-white/80 bg-white/90 px-3 shadow-[0_8px_28px_rgba(37,38,58,0.08)] backdrop-blur-md sm:left-6 sm:right-6 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7867f5] text-white shadow-md shadow-violet-200">
            <Pen className="h-[17px] w-[17px]" strokeWidth={2.4} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-[15px] font-semibold tracking-[-0.03em]">SketchFlow</span>
              <span className="hidden max-w-[180px] truncate rounded-lg px-1.5 py-1 text-xs text-[#686a7b] sm:inline-flex" title={boardId}>
                {boardId} <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0 text-[#a0a1ae]" />
              </span>
            </div>
            <span className="hidden text-[10px] text-[#a0a1ae] sm:block">Board session</span>
          </div>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-xl bg-[#f7f7fa] p-1 sm:flex">
          <IconButton label="Undo" shortcut="⌘ Z" disabled={!past.length} onClick={undo}><Undo2 /></IconButton>
          <IconButton label="Redo" shortcut="⌘ ⇧ Z" disabled={!future.length} onClick={redo}><Redo2 /></IconButton>
          <span className="mx-1 h-5 w-px bg-[#e7e7ed]" />
          <button onClick={() => setZoom((value) => Math.max(0.4, value - 0.1))} aria-label="Zoom out" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#77798b] transition-all duration-200 hover:bg-white hover:text-[#28283b]"><Minus className="h-4 w-4" /></button>
          <span className="min-w-[42px] text-center text-xs font-medium tabular-nums text-[#696b7e]">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((value) => Math.min(2, value + 0.1))} aria-label="Zoom in" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#77798b] transition-all duration-200 hover:bg-white hover:text-[#28283b]"><Plus className="h-4 w-4" /></button>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden h-9 items-center rounded-xl px-3 text-xs font-semibold text-[#77798b] transition hover:bg-[#f4f2ff] hover:text-[#7867f5] sm:inline-flex">All boards</Link>
          <button onClick={exportSvg} className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#7867f5] px-3.5 text-xs font-semibold text-white shadow-md shadow-violet-200 transition-all duration-200 hover:bg-[#6957eb] hover:shadow-lg active:scale-[0.98] sm:px-4 sm:text-[13px]">
            {saved ? <Check className="h-4 w-4" /> : <ArrowDownToLine className="h-4 w-4" />}
            <span className="hidden sm:inline">{saved ? "Exported" : "Export"}</span>
          </button>
        </div>
      </header>

      <aside className="absolute left-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1 rounded-2xl border border-white/80 bg-white/90 p-1.5 shadow-[0_8px_28px_rgba(37,38,58,0.1)] backdrop-blur-md sm:left-6 sm:p-2">
        {tools.map(({ id, label, shortcut, icon: Icon }, index) => (
          <div key={id} className="contents">
            {index === 2 || index === 6 ? <span className="mx-2 my-1 h-px bg-[#ececf1]" /> : null}
            <IconButton label={label} shortcut={shortcut} active={activeTool === id} onClick={() => setActiveTool(id)}><Icon /></IconButton>
          </div>
        ))}
        <span className="mx-2 my-1 h-px bg-[#ececf1]" />
        <IconButton label="Clear canvas" shortcut="⌫" onClick={clearCanvas} disabled={!items.length}><Trash2 /></IconButton>
      </aside>

      <aside className="absolute right-4 top-1/2 z-20 hidden w-[214px] -translate-y-1/2 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_8px_28px_rgba(37,38,58,0.1)] backdrop-blur-md md:block lg:right-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-[13px] font-semibold tracking-[-0.02em]">Style</p>
            <p className="mt-0.5 text-[10px] text-[#9b9caa]">Customize your strokes</p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f4f2ff] text-[#7867f5]"><Pen className="h-3.5 w-3.5" /></div>
        </div>
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-medium text-[#77798b]">Stroke width</span><span className="text-[10px] text-[#a1a2af]">{style.strokeWidth}px</span></div>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#f7f7fa] p-1">
            {[1.5, 2.5, 4].map((width, index) => <button key={width} onClick={() => setStyle((current) => ({ ...current, strokeWidth: width }))} className={`flex h-8 items-center justify-center rounded-lg transition-all duration-200 ${style.strokeWidth === width ? "bg-white text-[#7867f5] shadow-sm" : "text-[#9091a1] hover:text-[#4c4d61]"}`} aria-label={`${["Thin", "Medium", "Thick"][index]} stroke`}><span className="w-6 rounded-full bg-current" style={{ height: width }} /></button>)}
          </div>
        </div>
        <div className="mb-4">
          <span className="mb-2 block text-[11px] font-medium text-[#77798b]">Stroke style</span>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#f7f7fa] p-1">
            <button onClick={() => setStyle((current) => ({ ...current, dashed: false }))} className={`flex h-8 items-center justify-center gap-1.5 rounded-lg text-[10px] transition-all duration-200 ${!style.dashed ? "bg-white font-medium text-[#7867f5] shadow-sm" : "text-[#9091a1] hover:text-[#4c4d61]"}`}><span className="h-0.5 w-5 rounded bg-current" />Solid</button>
            <button onClick={() => setStyle((current) => ({ ...current, dashed: true }))} className={`flex h-8 items-center justify-center gap-1.5 rounded-lg text-[10px] transition-all duration-200 ${style.dashed ? "bg-white font-medium text-[#7867f5] shadow-sm" : "text-[#9091a1] hover:text-[#4c4d61]"}`}><span className="w-5 border-t-2 border-dashed border-current" />Dashed</button>
          </div>
        </div>
        <div>
          <span className="mb-2 block text-[11px] font-medium text-[#77798b]">Color</span>
          <div className="flex items-center justify-between gap-1">
            {colors.map((color) => <button key={color.value} onClick={() => setStyle((current) => ({ ...current, color: color.value }))} aria-label={`${color.name} color`} aria-pressed={style.color === color.value} className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${style.color === color.value ? "ring-2 ring-[#7867f5] ring-offset-2" : ""}`} style={{ backgroundColor: color.value }}>{style.color === color.value ? <Check className="h-3 w-3 text-white" strokeWidth={3} /> : null}</button>)}
          </div>
        </div>
      </aside>

      <div className="absolute bottom-[58px] left-[68px] right-4 z-20 rounded-xl border border-white/80 bg-white/90 px-3 py-2 shadow-[0_8px_28px_rgba(37,38,58,0.1)] backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {[1.5, 2.5, 4].map((width) => <button key={width} onClick={() => setStyle((current) => ({ ...current, strokeWidth: width }))} aria-label={`Set stroke width to ${width}px`} className={`flex h-7 w-7 items-center justify-center rounded-lg ${style.strokeWidth === width ? "bg-[#f4f2ff] text-[#7867f5]" : "text-[#9091a1]"}`}><span className="w-4 rounded-full bg-current" style={{ height: width }} /></button>)}
          </div>
          <button onClick={() => setStyle((current) => ({ ...current, dashed: !current.dashed }))} aria-label="Toggle stroke style" className="flex h-7 items-center gap-1.5 rounded-lg bg-[#f7f7fa] px-2 text-[9px] text-[#77798b]"><span className={`w-4 border-t-2 ${style.dashed ? "border-dashed" : "border-solid"} border-current`} />{style.dashed ? "Dashed" : "Solid"}</button>
          <div className="flex items-center gap-1">
            {colors.map((color) => <button key={color.value} onClick={() => setStyle((current) => ({ ...current, color: color.value }))} aria-label={`${color.name} color`} className={`h-5 w-5 rounded-full ${style.color === color.value ? "ring-2 ring-[#7867f5] ring-offset-1" : ""}`} style={{ backgroundColor: color.value }} />)}
          </div>
        </div>
      </div>

      <svg
        ref={svgRef}
        className={`absolute inset-0 h-full w-full touch-none ${activeTool === "move" || spaceHeld ? "cursor-grab active:cursor-grabbing" : activeTool === "select" ? "cursor-default" : activeTool === "eraser" ? "cursor-cell" : "cursor-crosshair"}`}
        onWheel={(event) => setZoom((value) => Math.min(2, Math.max(0.4, value - Math.sign(event.deltaY) * 0.08)))}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        aria-label="SketchFlow drawing canvas"
      >
        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          {items.map((item) => <ShapeView key={item.id} item={item} selected={item.id === selectedId} />)}
          {draft ? <ShapeView item={draft} /> : null}
        </g>
      </svg>

      <div className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 rounded-xl border border-white/80 bg-white/85 px-4 py-2 text-[10px] text-[#858697] shadow-[0_6px_24px_rgba(37,38,58,0.07)] backdrop-blur-md sm:flex">
        <span className="flex items-center gap-1.5"><span className="rounded border border-[#e4e4eb] bg-white px-1.5 py-0.5 text-[9px] font-medium text-[#686a7b]">Space</span> to pan</span>
        <span className="h-3 w-px bg-[#e8e8ee]" />
        <span>Scroll to zoom</span>
        <span className="h-3 w-px bg-[#e8e8ee]" />
        <span>{items.length} {items.length === 1 ? "object" : "objects"}</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-xl border border-white/80 bg-white/90 p-1 shadow-[0_6px_24px_rgba(37,38,58,0.08)] backdrop-blur-md sm:hidden">
        <button onClick={undo} aria-label="Undo" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#77798b] disabled:opacity-40"><Undo2 className="h-4 w-4" /></button>
        <button onClick={redo} aria-label="Redo" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#77798b] disabled:opacity-40"><Redo2 className="h-4 w-4" /></button>
        <span className="min-w-[38px] text-center text-[10px] tabular-nums text-[#696b7e]">{Math.round(zoom * 100)}%</span>
      </div>

      {items.length === 0 && !draft ? <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/80 text-[#9a8df5] shadow-sm"><Pen className="h-5 w-5" /></div>
        <p className="text-sm font-medium text-[#77798b]">A blank canvas, full of possibility</p>
        <p className="mt-1 text-[11px] text-[#a2a3af]">Pick a tool and start sketching</p>
      </div> : null}
    </main>
  )
}

function IconButton({ children, label, shortcut, active, disabled, onClick }: { children: React.ReactNode; label: string; shortcut?: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return <div className="group relative">
    <button onClick={onClick} aria-label={label} aria-pressed={active} disabled={disabled} className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 active:scale-95 sm:h-10 sm:w-10 ${active ? "bg-[#7867f5] text-white shadow-md shadow-violet-200" : "text-[#77798b] hover:bg-[#f4f2ff] hover:text-[#7867f5]"} disabled:cursor-not-allowed disabled:opacity-35`}>
      {children}
    </button>
    <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-2.5 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#28283b] px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 sm:block">{label}{shortcut ? <span className="ml-2 text-white/50">{shortcut}</span> : null}</span>
  </div>
}

function ShapeView({ item, selected = false }: { item: DrawItem; selected?: boolean }) {
  const common = { fill: "none", stroke: item.color, strokeWidth: item.strokeWidth, strokeDasharray: item.dashed ? "7 6" : undefined, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, vectorEffect: "non-scaling-stroke" as const }
  const selection = selected ? <rect x={Math.min(item.x1, item.x2) - 8} y={Math.min(item.y1, item.y2) - 8} width={Math.max(Math.abs(item.x2 - item.x1), 1) + 16} height={Math.max(Math.abs(item.y2 - item.y1), 1) + 16} rx={5} fill="none" stroke="#7867f5" strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" /> : null
  let shape: React.ReactNode
  if (item.type === "rectangle") {
    shape = <rect x={Math.min(item.x1, item.x2)} y={Math.min(item.y1, item.y2)} width={Math.abs(item.x2 - item.x1)} height={Math.abs(item.y2 - item.y1)} rx={8} {...common} />
  } else if (item.type === "circle") {
    shape = <ellipse cx={(item.x1 + item.x2) / 2} cy={(item.y1 + item.y2) / 2} rx={Math.abs(item.x2 - item.x1) / 2} ry={Math.abs(item.y2 - item.y1) / 2} {...common} />
  } else if (item.type === "arrow") {
    const angle = Math.atan2(item.y2 - item.y1, item.x2 - item.x1)
    const size = 10 + item.strokeWidth
    const left = { x: item.x2 - size * Math.cos(angle - Math.PI / 6), y: item.y2 - size * Math.sin(angle - Math.PI / 6) }
    const right = { x: item.x2 - size * Math.cos(angle + Math.PI / 6), y: item.y2 - size * Math.sin(angle + Math.PI / 6) }
    shape = <g {...common}><line x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2} /><polyline points={`${left.x},${left.y} ${item.x2},${item.y2} ${right.x},${right.y}`} /></g>
  } else if (item.points && item.points.length > 1) {
    shape = <polyline points={item.points.map((point) => `${point.x},${point.y}`).join(" ")} {...common} />
  } else {
    shape = <line x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2} {...common} />
  }
  return <g>{shape}{selection}</g>
}

function hitTest(item: DrawItem, point: Point) {
  const minX = Math.min(item.x1, item.x2) - 12
  const maxX = Math.max(item.x1, item.x2) + 12
  const minY = Math.min(item.y1, item.y2) - 12
  const maxY = Math.max(item.y1, item.y2) + 12
  if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) return false
  if (item.type === "circle") {
    const rx = Math.max(Math.abs(item.x2 - item.x1) / 2, 12)
    const ry = Math.max(Math.abs(item.y2 - item.y1) / 2, 12)
    const dx = (point.x - (item.x1 + item.x2) / 2) / rx
    const dy = (point.y - (item.y1 + item.y2) / 2) / ry
    return dx * dx + dy * dy <= 1.25
  }
  return true
}
