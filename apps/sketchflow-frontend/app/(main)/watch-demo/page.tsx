import Link from "next/link"
import { ArrowRight, ArrowUpRight, Circle, Download, Hand, MousePointer2, Pencil, RectangleHorizontal, Shapes, Share2, Sparkles, Trash2 } from "lucide-react"

const tools = [
  { icon: MousePointer2, name: "Select", shortcut: "V" },
  { icon: Hand, name: "Move canvas", shortcut: "H" },
  { icon: Pencil, name: "Freehand", shortcut: "P" },
  { icon: RectangleHorizontal, name: "Rectangle", shortcut: "R" },
  { icon: Circle, name: "Ellipse", shortcut: "O" },
  { icon: ArrowUpRight, name: "Arrow", shortcut: "A" },
  { icon: Trash2, name: "Eraser", shortcut: "E" },
]

const steps = [
  { number: "01", title: "Create your space", description: "Sign up, open your dashboard, and give a new board a name that gets the idea started." },
  { number: "02", title: "Put the idea down", description: "Choose a tool, pick a color, and sketch a shape, flow, or thought right onto the canvas." },
  { number: "03", title: "Take it with you", description: "Export the current canvas as a PNG or copy the board link from your workspace." },
]

export default function WatchDemoPage() {
  return (
    <div className="bg-[#fbfaf8] text-[#292638]">
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-14 sm:px-10 lg:px-12 lg:pb-16 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center"><span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3.5 py-2 text-xs font-semibold text-violet-700"><Sparkles className="h-3.5 w-3.5"/> Inside your workspace</span><h1 className="mt-6 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl lg:text-6xl">A clearer way to <span className="text-violet-600">think together.</span></h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#77737f] sm:text-lg">Your board brings drawing, quick diagrams, and shared thinking into one focused workspace.</p></div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[24px] border border-[#e9e5ed] bg-white shadow-[0_28px_80px_-32px_rgba(55,43,94,0.23)]">
          <div className="flex h-12 items-center justify-between border-b border-[#f0edf2] px-4 sm:px-6"><div className="flex items-center gap-2.5"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><Shapes className="h-4 w-4"/></span><span className="text-xs font-semibold">A quick look around</span></div><span className="hidden items-center gap-1.5 text-[10px] text-[#93909b] sm:flex"><Download className="h-3.5 w-3.5"/> PNG export available</span></div>
          <div className="grid min-h-[360px] lg:grid-cols-[1fr_260px]">
            <div className="relative min-h-[340px] overflow-hidden bg-[#fcfbfd]" style={{ backgroundImage: "radial-gradient(#d9d4e2 0.8px, transparent 0.8px)", backgroundSize: "18px 18px" }}><div className="absolute left-[12%] top-[25%] rotate-[-4deg] rounded-xl border border-[#eed6ac] bg-[#fff4d8] px-5 py-4 shadow-md"><p className="text-xs font-semibold text-[#57472b]">Start with a question</p><p className="mt-1 text-[10px] text-[#8d7b58]">What are we making?</p></div><svg className="absolute left-[34%] top-[27%] h-[110px] w-[22%]" viewBox="0 0 160 110"><path d="M5 18 C65 5 95 80 145 82" fill="none" stroke="#8a7ce0" strokeWidth="2.5" strokeDasharray="5 5"/><path d="m136 75 10 8-11 4" fill="none" stroke="#8a7ce0" strokeWidth="2.5"/></svg><div className="absolute left-[45%] top-[43%] flex h-[76px] w-[138px] items-center justify-center rounded-[20px] border-2 border-violet-300 bg-violet-50 text-center text-xs font-semibold leading-5 text-violet-800">Shape the<br/>first step</div><div className="absolute right-[10%] top-[24%] rotate-3 rounded-xl border border-[#cce5d6] bg-[#e9f8ef] px-5 py-4 shadow-md"><p className="text-xs font-semibold text-[#385f47]">Then try this</p><p className="mt-1 text-[10px] text-[#53725e]">Make it feel simple</p></div><div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-[#e9e5ed] bg-white p-1.5 shadow-lg">{tools.slice(0, 6).map(({ icon: Icon, name }, i) => <span key={name} className={`flex h-8 w-8 items-center justify-center rounded-lg ${i === 2 ? "bg-violet-100 text-violet-700" : "text-[#817d89]"}`}><Icon className="h-4 w-4"/></span>)}</div></div>
            <aside className="border-t border-[#f0edf2] bg-white p-5 lg:border-l lg:border-t-0"><h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#aaa6b0]">Canvas tools</h2><div className="mt-4 space-y-2">{tools.map(({ icon: Icon, name, shortcut }) => <div key={name} className="flex items-center justify-between rounded-lg px-2 py-2 text-xs text-[#5f5b67]"><span className="flex items-center gap-2.5"><Icon className="h-4 w-4 text-violet-600"/>{name}</span><kbd className="rounded border border-[#eeebf1] bg-[#fdfcfe] px-1.5 py-0.5 text-[10px] text-[#9995a1]">{shortcut}</kbd></div>)}</div><div className="mt-5 rounded-xl bg-[#f8f6fb] p-3 text-[11px] leading-5 text-[#85818d]"><span className="font-semibold text-[#5f596e]">Tip</span><br/>Hold Space to move around. Scroll to zoom in and out.</div></aside>
          </div>
        </div>
      </section>

      <section className="border-y border-[#eeebf1] bg-white px-6 py-16 sm:px-10 lg:px-12 lg:py-20"><div className="mx-auto max-w-7xl"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">A simple working loop</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Three steps to get it out of your head.</h2></div><div className="mt-9 grid gap-4 md:grid-cols-3">{steps.map((step) => <article key={step.number} className="rounded-2xl border border-[#eeebf1] bg-[#fdfcfe] p-6"><span className="text-xs font-bold tracking-widest text-violet-500">{step.number}</span><h3 className="mt-7 text-base font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#77737f]">{step.description}</p></article>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20"><div className="flex flex-col items-start justify-between gap-6 rounded-[24px] bg-[#292638] p-7 text-white sm:p-10 lg:flex-row lg:items-center"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-200"><Share2 className="h-3.5 w-3.5"/> Your turn</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Start with whatever’s on your mind.</h2></div><Link href="/signup" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#292638] transition hover:bg-violet-100">Create your first board <ArrowRight className="h-4 w-4"/></Link></div></section>
    </div>
  )
}
