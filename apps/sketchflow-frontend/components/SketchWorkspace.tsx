"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Circle,
  Command,
  Eye,
  EyeOff,
  Hand,
  MousePointer2,
  Pen,
  Plus,
  Redo2,
  RotateCcw,
  Share2,
  Square,
  Type,
  Undo2,
  WandSparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

type Tool = "hand" | "select" | "pen" | "rect" | "circle" | "arrow" | "text"
type CanvasElement = {
  id: string
  type: "pen" | "rect" | "circle" | "arrow" | "text"
  x: number
  y: number
  width: number
  height: number
  color: string
  opacity: number
  text?: string
  points?: { x: number; y: number }[]
}
type History = { past: CanvasElement[][]; current: CanvasElement[]; future: CanvasElement[][] }

const colors = [
  { name: "Violet", value: "#8b5cf6" },
  { name: "Cyan", value: "#22d3ee" },
  { name: "Emerald", value: "#34d399" },
  { name: "Rose", value: "#fb7185" },
  { name: "Amber", value: "#fbbf24" },
  { name: "White", value: "#f4f4f5" },
]
const initialElements: CanvasElement[] = [
  { id: "flow-title", type: "text", x: 570, y: 160, width: 250, height: 30, color: "#f4f4f5", opacity: 1, text: "Product launch flow" },
  { id: "flow-subtitle", type: "text", x: 570, y: 188, width: 210, height: 20, color: "#777789", opacity: 1, text: "A clear path from idea to impact" },
  { id: "idea", type: "rect", x: 460, y: 300, width: 176, height: 112, color: "#8b5cf6", opacity: 1, text: "01   /   DISCOVER" },
  { id: "build", type: "rect", x: 710, y: 300, width: 176, height: 112, color: "#22d3ee", opacity: 1, text: "02   /   BUILD" },
  { id: "launch", type: "rect", x: 960, y: 300, width: 176, height: 112, color: "#34d399", opacity: 1, text: "03   /   LAUNCH" },
  { id: "idea-note", type: "text", x: 476, y: 354, width: 150, height: 24, color: "#ddd6fe", opacity: 1, text: "Find the signal" },
  { id: "build-note", type: "text", x: 726, y: 354, width: 150, height: 24, color: "#cffafe", opacity: 1, text: "Make it tangible" },
  { id: "launch-note", type: "text", x: 976, y: 354, width: 150, height: 24, color: "#d1fae5", opacity: 1, text: "Ship with intent" },
  { id: "arrow-one", type: "arrow", x: 640, y: 356, width: 66, height: 0, color: "#686879", opacity: 1 },
  { id: "arrow-two", type: "arrow", x: 890, y: 356, width: 66, height: 0, color: "#686879", opacity: 1 },
  { id: "caption", type: "text", x: 572, y: 510, width: 480, height: 28, color: "#777789", opacity: 1, text: "Small, thoughtful steps. Beautiful things happen." },
]

const tools: { id: Tool; label: string; icon: typeof Hand; shortcut: string }[] = [
  { id: "hand", label: "Hand", icon: Hand, shortcut: "H" },
  { id: "select", label: "Select", icon: MousePointer2, shortcut: "V" },
  { id: "pen", label: "Draw", icon: Pen, shortcut: "P" },
  { id: "rect", label: "Rectangle", icon: Square, shortcut: "R" },
  { id: "circle", label: "Circle", icon: Circle, shortcut: "O" },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight, shortcut: "A" },
  { id: "text", label: "Text", icon: Type, shortcut: "T" },
]

export default function SketchWorkspace() {
  const [tool, setTool] = useState<Tool>("select")
  const [history, setHistory] = useState<History>({ past: [], current: initialElements, future: [] })
  const [selectedId, setSelectedId] = useState<string | null>("build")
  const [color, setColor] = useState("#22d3ee")
  const [opacity, setOpacity] = useState(100)
  const [strokeWidth, setStrokeWidth] = useState("1.5")
  const [strokeType, setStrokeType] = useState("Solid")
  const [gridVisible, setGridVisible] = useState(true)
  const [glowEnabled, setGlowEnabled] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isSpaceDown, setIsSpaceDown] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const elements = history.current
  const selected = elements.find((element) => element.id === selectedId)

  const updateElements = useCallback((next: CanvasElement[]) => {
    setHistory((previous) => ({ past: [...previous.past, previous.current], current: next, future: [] }))
  }, [])

  const undo = useCallback(() => {
    setHistory((previous) => {
      if (!previous.past.length) return previous
      return { past: previous.past.slice(0, -1), current: previous.past[previous.past.length - 1], future: [previous.current, ...previous.future] }
    })
  }, [])

  const redo = useCallback(() => {
    setHistory((previous) => {
      if (!previous.future.length) return previous
      return { past: [...previous.past, previous.current], current: previous.future[0], future: previous.future.slice(1) }
    })
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault()
        setIsSpaceDown(true)
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
      }
      if (event.key === "Escape") setSelectedId(null)
    }
    const onKeyUp = (event: KeyboardEvent) => { if (event.code === "Space") setIsSpaceDown(false) }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp) }
  }, [redo, undo])

  const pointFromEvent = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: (event.clientX - bounds.left - pan.x) / zoom, y: (event.clientY - bounds.top - pan.y) / zoom }
  }

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return
    const point = pointFromEvent(event)
    if (tool === "hand" || isSpaceDown) {
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y })
      return
    }
    if (tool === "select") { setSelectedId(null); return }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragStart(point)
    if (tool === "text") {
      const value = window.prompt("Add a note", "Your idea here")
      if (value) updateElements([...elements, { id: crypto.randomUUID(), type: "text", x: point.x, y: point.y, width: 180, height: 28, color, opacity: opacity / 100, text: value }])
      setDragStart(null)
    }
  }

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragStart) return
    if (tool === "hand" || isSpaceDown) {
      setPan({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y })
      return
    }
    if (tool === "pen") {
      const point = pointFromEvent(event)
      setHistory((previous) => {
        const last = previous.current[previous.current.length - 1]
        if (!last || last.id !== "active-stroke") {
          const stroke: CanvasElement = { id: "active-stroke", type: "pen", x: dragStart.x, y: dragStart.y, width: 0, height: 0, color, opacity: opacity / 100, points: [dragStart, point] }
          return { ...previous, current: [...previous.current, stroke] }
        }
        const updated = { ...last, points: [...(last.points ?? []), point] }
        return { ...previous, current: [...previous.current.slice(0, -1), updated] }
      })
    }
  }

  const handlePointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragStart) return
    if (tool === "hand" || isSpaceDown) { setDragStart(null); return }
    if (tool === "pen") {
      setHistory((previous) => ({ past: [...previous.past, previous.current.filter((item) => item.id !== "active-stroke")], current: previous.current.map((item) => item.id === "active-stroke" ? { ...item, id: crypto.randomUUID() } : item), future: [] }))
      setDragStart(null)
      return
    }
    const point = pointFromEvent(event)
    const x = Math.min(dragStart.x, point.x)
    const y = Math.min(dragStart.y, point.y)
    const width = Math.max(Math.abs(point.x - dragStart.x), 2)
    const height = Math.max(Math.abs(point.y - dragStart.y), 2)
    const newElement: CanvasElement = {
      id: crypto.randomUUID(), type: tool as CanvasElement["type"], x, y, width, height,
      color, opacity: opacity / 100,
    }
    updateElements([...elements, newElement])
    setSelectedId(newElement.id)
    setDragStart(null)
  }

  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault()
    if (isSpaceDown && !event.ctrlKey && !event.metaKey) {
      setPan((current) => ({ x: current.x - event.deltaX, y: current.y - event.deltaY }))
    } else {
      setZoom((current) => Math.min(2, Math.max(0.35, current * (event.deltaY < 0 ? 1.08 : 0.92))))
    }
  }

  const changeZoom = (amount: number) => setZoom((current) => Math.min(2, Math.max(0.35, current + amount)))

  const exportCanvas = () => {
    const source = svgRef.current
    if (!source) return
    const clone = source.cloneNode(true) as SVGSVGElement
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    clone.setAttribute("width", String(source.clientWidth))
    clone.setAttribute("height", String(source.clientHeight))
    clone.setAttribute("viewBox", `0 0 ${source.clientWidth} ${source.clientHeight}`)
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "sketchflow-board.svg"
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000)
  }

  const shareBoard = async () => {
    await navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const updateSelectedColor = (value: string) => {
    setColor(value)
    if (selectedId) updateElements(elements.map((element) => element.id === selectedId ? { ...element, color: value } : element))
  }

  const renderElement = (element: CanvasElement) => {
    const selectedElement = element.id === selectedId
    const common = { stroke: element.color, strokeWidth: strokeWidth === "0.75" ? 1.5 : strokeWidth === "3" ? 3 : 2, strokeDasharray: strokeType === "Dashed" ? "7 5" : strokeType === "Dotted" ? "1 5" : undefined, opacity: element.opacity, vectorEffect: "non-scaling-stroke" as const, style: glowEnabled ? { filter: `drop-shadow(0 0 7px ${element.color}88)` } : undefined }
    return <g key={element.id} onPointerDown={(event) => { if (tool === "select") { event.stopPropagation(); setSelectedId(element.id); setColor(element.color); setOpacity(Math.round(element.opacity * 100)) } }} className={tool === "select" ? "cursor-pointer" : undefined}>
      {element.type === "rect" && <><rect x={element.x} y={element.y} width={element.width} height={element.height} rx="12" fill={`${element.color}12`} {...common} /><text x={element.x + 16} y={element.y + 28} fill={element.color} fontSize="10" fontWeight="600" letterSpacing="1.5">{element.text}</text></>}
      {element.type === "circle" && <circle cx={element.x + element.width / 2} cy={element.y + element.height / 2} rx={element.width / 2} ry={element.height / 2} fill={`${element.color}20`} {...common} />}
      {element.type === "arrow" && <><line x1={element.x} y1={element.y} x2={element.x + element.width} y2={element.y + element.height} {...common} /><path d={`M ${element.x + element.width - 8} ${element.y + element.height - 6} L ${element.x + element.width} ${element.y + element.height} L ${element.x + element.width - 8} ${element.y + element.height + 6}`} fill="none" {...common} /></>}
      {element.type === "text" && <text x={element.x} y={element.y} fill={element.color} fontSize={element.id === "flow-title" ? 23 : element.id === "caption" ? 15 : 13} fontWeight={element.id === "flow-title" ? 650 : 450} letterSpacing={element.id === "flow-title" ? -0.5 : 0}>{element.text}</text>}
      {element.type === "pen" && <polyline points={(element.points ?? []).map((point) => `${point.x},${point.y}`).join(" ")} fill="none" strokeLinecap="round" strokeLinejoin="round" {...common} />}
      {selectedElement && element.type === "rect" && <rect x={element.x - 5} y={element.y - 5} width={element.width + 10} height={element.height + 10} rx="15" fill="none" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.8" vectorEffect="non-scaling-stroke" />}
    </g>
  }

  const toolTip = "transition-all duration-150 hover:bg-white/[0.07] active:scale-95"

  return <div className="fixed inset-0 z-[100] overflow-hidden bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30">
    <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 40% at 50% -8%, rgba(99,102,241,.14), transparent 75%)" }} />
    <div className={`pointer-events-none absolute inset-0 ${gridVisible ? "opacity-[0.12]" : "opacity-0"} transition-opacity duration-200`} style={{ backgroundImage: "linear-gradient(rgba(148,163,184,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.12) 1px, transparent 1px)", backgroundSize: "72px 72px", maskImage: "linear-gradient(to bottom, black, transparent 90%)" }} />

    <header className="absolute left-3 right-3 top-3 z-20 flex min-h-[58px] items-center justify-between gap-2 rounded-2xl border border-white/[0.09] bg-zinc-950/75 px-3 shadow-[0_16px_55px_rgba(0,0,0,.38)] backdrop-blur-2xl sm:left-5 sm:right-5 sm:top-5 sm:min-h-[66px] sm:px-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-[10px] border border-indigo-300/25 bg-gradient-to-br from-indigo-400/30 to-violet-600/20 text-indigo-200 shadow-[0_0_22px_rgba(99,102,241,.25)]">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none"><path d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z" stroke="currentColor" strokeWidth="1.6" /><path d="m8 13 2.2-2.2 2 2 3.8-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <span className="hidden text-[15px] font-semibold tracking-[-0.045em] text-zinc-100 sm:inline">SketchFlow</span>
        </div>
        <div className="hidden h-6 w-px bg-white/10 sm:block" />
        <div className="hidden min-w-0 items-center gap-2 text-[12px] sm:flex"><span className="text-zinc-500">Drafts</span><span className="text-zinc-700">/</span><span className="truncate text-zinc-300">flow-1</span><span className="ml-1 rounded-md border border-white/[0.08] bg-white/[0.035] px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-zinc-500">SAVED</span></div>
      </div>

      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-xl border border-white/[0.08] bg-zinc-900/90 p-1 shadow-inner shadow-black/40 md:flex">
        {tools.map(({ id, label, icon: Icon, shortcut }) => <button key={id} type="button" aria-label={`${label} tool`} title={`${label} · ${shortcut}`} onClick={() => setTool(id)} className={`group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-150 active:scale-95 ${tool === id ? "bg-indigo-500/15 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,.18)] ring-1 ring-indigo-400/25" : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"}`}><Icon size={16} strokeWidth={1.8} /><span className="pointer-events-none absolute -bottom-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-300 shadow-xl group-hover:block">{label}<span className="ml-2 text-zinc-500">{shortcut}</span></span></button>)}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button type="button" onClick={shareBoard} className="hidden h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-3 text-[12px] font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] sm:flex"><Share2 size={14} />{copied ? "Copied" : "Share"}</button>
        <button type="button" onClick={exportCanvas} className="flex h-9 items-center gap-1.5 rounded-lg bg-indigo-500 px-3 text-[12px] font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,.2)] transition hover:bg-indigo-400 hover:shadow-[0_0_25px_rgba(99,102,241,.35)] active:scale-95 sm:gap-2 sm:px-3.5"><ArrowDownToLine size={14} />Export</button>
        <div className="ml-1 hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-rose-300 to-violet-400 p-[2px] sm:flex"><div className="flex h-full w-full items-center justify-center rounded-full bg-[#24202a] text-[10px] font-semibold text-white">AG</div><span className="absolute ml-[25px] mt-[25px] h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-400" /></div>
      </div>
    </header>

    <div className="absolute left-1/2 top-[82px] z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-xl border border-white/[0.08] bg-zinc-950/80 p-1 shadow-xl backdrop-blur-xl md:hidden">
      {tools.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-label={`${label} tool`} onClick={() => setTool(id)} className={`flex h-8 w-8 items-center justify-center rounded-lg transition active:scale-95 ${tool === id ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/25" : "text-zinc-500 hover:text-zinc-200"}`}><Icon size={15} /></button>)}
    </div>

    <svg ref={svgRef} className={`absolute inset-0 h-full w-full touch-none ${tool === "hand" || isSpaceDown ? "cursor-grab active:cursor-grabbing" : tool === "select" ? "cursor-default" : "cursor-crosshair"}`} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={() => setDragStart(null)} onWheel={handleWheel}>
      <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>{elements.map(renderElement)}</g>
    </svg>

    <div className="absolute bottom-5 left-4 z-20 flex flex-col items-center gap-1 rounded-2xl border border-white/[0.09] bg-zinc-950/75 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,.35)] backdrop-blur-2xl sm:bottom-7 sm:left-7 sm:p-2">
      <button type="button" aria-label="Zoom out" onClick={() => changeZoom(-0.1)} className={`flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 ${toolTip}`}><ZoomOut size={16} /></button>
      <button type="button" onClick={() => setZoom(1)} className="w-9 rounded-lg py-1 text-center text-[10px] font-medium tabular-nums text-zinc-300 transition hover:bg-white/[0.06]">{Math.round(zoom * 100)}%</button>
      <button type="button" aria-label="Zoom in" onClick={() => changeZoom(0.1)} className={`flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 ${toolTip}`}><ZoomIn size={16} /></button>
      <div className="my-1 h-px w-6 bg-white/10" />
      <button type="button" aria-label="Undo" onClick={undo} disabled={!history.past.length} className={`flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 disabled:opacity-30 ${toolTip}`}><Undo2 size={16} /></button>
      <button type="button" aria-label="Redo" onClick={redo} disabled={!history.future.length} className={`flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 disabled:opacity-30 ${toolTip}`}><Redo2 size={16} /></button>
      <div className="my-1 h-px w-6 bg-white/10" />
      <button type="button" aria-label="Toggle grid" onClick={() => setGridVisible(!gridVisible)} className={`flex h-9 w-9 items-center justify-center rounded-xl ${gridVisible ? "text-indigo-300" : "text-zinc-500"} ${toolTip}`}><Command size={16} /></button>
      <button type="button" aria-label="Reset view" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }} className={`flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 ${toolTip}`}><RotateCcw size={15} /></button>
    </div>

    <aside className="absolute bottom-5 right-5 top-[112px] z-20 hidden w-[248px] flex-col overflow-y-auto rounded-2xl border border-white/[0.09] bg-zinc-950/75 p-4 shadow-[0_16px_55px_rgba(0,0,0,.35)] backdrop-blur-2xl xl:flex">
      <div className="flex items-start justify-between"><div><p className="text-[13px] font-semibold tracking-[-0.02em] text-zinc-100">Design</p><p className="mt-1 text-[11px] text-zinc-500">{selected ? selected.type[0].toUpperCase() + selected.type.slice(1) : "Canvas settings"}</p></div><button aria-label="Hide grid" onClick={() => setGridVisible(!gridVisible)} className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200">{gridVisible ? <Eye size={15} /> : <EyeOff size={15} />}</button></div>
      <div className="my-4 h-px bg-white/[0.08]" />
      <section><div className="mb-3 flex items-center justify-between"><h2 className="text-[11px] font-medium text-zinc-300">Fill &amp; stroke</h2><span className="font-mono text-[10px] text-zinc-500">{color.toUpperCase()}</span></div><div className="flex items-center gap-2">
        {colors.map((swatch) => <button key={swatch.value} type="button" title={swatch.name} aria-label={`${swatch.name} color`} onClick={() => updateSelectedColor(swatch.value)} className={`h-[22px] w-[22px] rounded-full border transition hover:scale-110 ${color === swatch.value ? "border-white/80 ring-2 ring-white/15 ring-offset-2 ring-offset-zinc-950" : "border-white/10"}`} style={{ backgroundColor: swatch.value }} />)}
        <label title="Custom color" className="relative ml-auto flex h-[22px] w-[22px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-rose-400 via-violet-400 to-cyan-300"><input aria-label="Custom color" type="color" value={color} onChange={(event) => updateSelectedColor(event.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" /><Plus size={12} className="pointer-events-none text-white drop-shadow" /></label>
      </div></section>
      <div className="my-4 h-px bg-white/[0.08]" />
      <section><h2 className="mb-3 text-[11px] font-medium text-zinc-300">Stroke width</h2><div className="grid grid-cols-3 gap-1 rounded-lg border border-white/[0.07] bg-black/20 p-1">{[{ label: "Thin", value: "0.75" }, { label: "Medium", value: "1.5" }, { label: "Thick", value: "3" }].map((option) => <button key={option.value} onClick={() => setStrokeWidth(option.value)} className={`rounded-md py-1.5 text-[10px] transition ${strokeWidth === option.value ? "bg-white/[0.1] text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>{option.label}</button>)}</div></section>
      <section className="mt-4"><h2 className="mb-3 text-[11px] font-medium text-zinc-300">Stroke style</h2><div className="flex gap-2">{["Solid", "Dashed", "Dotted"].map((style) => <button key={style} onClick={() => setStrokeType(style)} aria-label={`${style} stroke`} className={`flex h-9 flex-1 items-center justify-center rounded-lg border transition ${strokeType === style ? "border-indigo-400/25 bg-indigo-400/[0.09]" : "border-white/[0.07] bg-black/15 hover:bg-white/[0.04]"}`}><span className={`w-6 border-t ${style === "Dashed" ? "border-dashed" : style === "Dotted" ? "border-dotted" : "border-solid"} ${strokeType === style ? "border-indigo-300" : "border-zinc-500"}`} /></button>)}</div></section>
      <div className="my-4 h-px bg-white/[0.08]" />
      <section><div className="mb-3 flex items-center justify-between"><h2 className="text-[11px] font-medium text-zinc-300">Opacity</h2><span className="font-mono text-[10px] text-zinc-500">{opacity}%</span></div><input aria-label="Opacity" type="range" min="10" max="100" value={opacity} onChange={(event) => { const value = Number(event.target.value); setOpacity(value); if (selectedId) updateElements(elements.map((element) => element.id === selectedId ? { ...element, opacity: value / 100 } : element)) }} className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-indigo-400" /></section>
      <section className="mt-5 flex items-center justify-between"><div><p className="text-[11px] font-medium text-zinc-300">Glow effect</p><p className="mt-1 text-[10px] text-zinc-600">Soft outer radiance</p></div><button type="button" role="switch" aria-checked={glowEnabled} onClick={() => setGlowEnabled(!glowEnabled)} className={`relative h-[21px] w-[37px] rounded-full transition ${glowEnabled ? "bg-indigo-500" : "bg-zinc-800"}`}><span className={`absolute top-[3px] h-[15px] w-[15px] rounded-full bg-white shadow transition-all ${glowEnabled ? "left-[19px]" : "left-[3px]"}`} /></button></section>
      <div className="mt-auto pt-6"><div className="rounded-xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.09] to-violet-500/[0.04] p-3.5"><div className="mb-2 flex items-center gap-2 text-indigo-300"><WandSparkles size={14} /><span className="text-[11px] font-medium">A little inspiration</span></div><p className="text-[10px] leading-relaxed text-zinc-500">Great ideas aren’t drawn in a straight line. Keep exploring.</p></div></div>
    </aside>

    <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/[0.07] bg-zinc-950/65 px-3 py-1.5 text-[10px] text-zinc-500 backdrop-blur-lg sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />Draft ready<span className="mx-1 h-3 w-px bg-white/10" /><span className="flex items-center gap-1"><Hand size={11} />Space to pan</span></div>
    <div className="pointer-events-none absolute bottom-7 right-7 z-10 hidden items-center gap-2 text-[10px] text-zinc-600 xl:flex"><span>Made for the big picture</span><ArrowRight size={12} /></div>
    <div className="sr-only" aria-live="polite">{gridVisible ? "Grid visible" : "Grid hidden"}; stroke style {strokeType}; glow {glowEnabled ? "on" : "off"}</div>
  </div>
}
