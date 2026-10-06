import Link from "next/link"
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Circle,
  Command,
  MousePointer2,
  Pencil,
  Plus,
  Share2,
  Shapes,
  Sparkles,
  Square,
  StickyNote,
  Users,
} from "lucide-react"

const features = [
  {
    icon: Pencil,
    title: "Think out loud",
    description: "Sketch the first version of an idea before the perfect words get in the way.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: Users,
    title: "Bring everyone in",
    description: "Give your team one shared space to shape plans, flows, and big questions.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Share2,
    title: "Keep ideas moving",
    description: "Create a board, share its link, and pick up the conversation where it left off.",
    color: "bg-emerald-100 text-emerald-700",
  },
]

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-[#fbfaf8] text-[#22212a]">
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 sm:px-10 lg:min-h-[650px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="pointer-events-none absolute -left-36 top-6 h-72 w-72 rounded-full bg-[#e8e2ff] opacity-70 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-violet-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            A little more room to think
          </div>
          <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-[4.45rem]">
            Good ideas don’t stay <span className="text-violet-600">in a straight line.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#706e79] sm:text-lg sm:leading-8">
            SketchFlow is a shared canvas for the early, messy, brilliant part of making something together.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/signup" className="group inline-flex h-12 items-center gap-3 rounded-xl bg-[#262333] px-5 text-sm font-semibold text-white shadow-lg shadow-[#262333]/15 transition hover:-translate-y-0.5 hover:bg-violet-700">
              Start sketching <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/watch-demo" className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#e9e6ed] bg-white px-5 text-sm font-semibold text-[#494653] transition hover:border-violet-200 hover:text-violet-700">
              See how it works <ArrowDownRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-xs text-[#85828d]">
            <div className="flex -space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#fbfaf8] bg-[#f4b9a7] text-[9px] font-bold text-[#6a3e37]">JD</div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#fbfaf8] bg-[#c8c0fa] text-[9px] font-bold text-[#423d75]">AK</div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#fbfaf8] bg-[#b9dece] text-[9px] font-bold text-[#355c4a]">ML</div>
            </div>
            <span>A shared space for your next big thing</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
          <div className="absolute -right-5 -top-6 z-10 hidden rotate-6 rounded-2xl border border-[#f0d9cb] bg-[#fff2e8] px-4 py-3 text-sm font-medium text-[#8e5641] shadow-lg shadow-[#462d23]/5 sm:block">wait… what if?</div>
          <div className="absolute -bottom-6 -left-5 z-10 hidden -rotate-3 rounded-2xl border border-[#d8d0fa] bg-[#f0edff] px-4 py-3 text-sm font-medium text-[#6656a8] shadow-lg shadow-[#462d23]/5 sm:block">yes, exactly this</div>
          <div className="overflow-hidden rounded-[24px] border border-[#e9e5ed] bg-white shadow-[0_28px_80px_-32px_rgba(55,43,94,0.28)]">
            <div className="flex h-12 items-center justify-between border-b border-[#f0edf2] px-4 sm:px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 text-violet-700"><Shapes className="h-3.5 w-3.5" /></div>
                <span className="text-xs font-semibold text-[#4c4955]">Launch ideas</span>
                <span className="hidden rounded-md bg-[#f6f4f8] px-2 py-1 text-[10px] text-[#9995a1] sm:inline">All changes saved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5"><span className="h-6 w-6 rounded-full border-2 border-white bg-[#f4b9a7]" /><span className="h-6 w-6 rounded-full border-2 border-white bg-[#c8c0fa]" /></div>
                <button className="flex h-7 items-center gap-1.5 rounded-lg bg-[#262333] px-2.5 text-[10px] font-semibold text-white"><Share2 className="h-3 w-3" /> Share</button>
              </div>
            </div>
            <div className="relative h-[300px] overflow-hidden bg-[#fcfbfd] sm:h-[380px]">
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(#d9d4e2 0.8px, transparent 0.8px)", backgroundSize: "18px 18px" }} />
              <div className="absolute left-1/2 top-1/2 h-[540px] w-[760px] -translate-x-1/2 -translate-y-1/2 scale-[0.66] sm:scale-[0.82]">
                <div className="absolute left-[68px] top-[88px] -rotate-6 rounded-xl border border-[#eed6ac] bg-[#fff4d8] px-5 py-4 shadow-md">
                  <p className="text-[13px] font-semibold text-[#57472b]">What are we solving?</p><p className="mt-1 text-[11px] text-[#8d7b58]">Make onboarding feel human</p>
                </div>
                <div className="absolute left-[325px] top-[104px] flex h-[86px] w-[150px] items-center justify-center rounded-[22px] border-2 border-violet-300 bg-violet-50 text-center text-[13px] font-semibold leading-5 text-violet-800">A warmer<br />welcome</div>
                <svg className="absolute left-[210px] top-[122px] h-[70px] w-[110px] overflow-visible" viewBox="0 0 110 70"><path d="M4 36 C40 4 70 65 100 33" fill="none" stroke="#8a7ce0" strokeWidth="2.5" strokeDasharray="5 5"/><path d="m94 26 10 7-10 7" fill="none" stroke="#8a7ce0" strokeWidth="2.5"/></svg>
                <div className="absolute left-[528px] top-[96px] rotate-3 rounded-xl border border-[#cce5d6] bg-[#e9f8ef] px-5 py-4 shadow-md">
                  <p className="text-[12px] font-semibold text-[#385f47]">First 5 minutes</p><p className="mt-2 text-[11px] leading-5 text-[#53725e]">Say hello<br />Show one small win</p>
                </div>
                <svg className="absolute left-[384px] top-[202px] h-[115px] w-[100px]" viewBox="0 0 100 115"><path d="M50 2 C90 28 87 70 50 105" fill="none" stroke="#e49a80" strokeWidth="2.5"/><path d="m41 98 9 10 5-12" fill="none" stroke="#e49a80" strokeWidth="2.5"/></svg>
                <div className="absolute left-[336px] top-[305px] rotate-2 rounded-xl border border-[#f1d4d1] bg-[#fff0ef] px-5 py-4 shadow-md"><p className="text-[12px] font-semibold text-[#854d4a]">Tiny celebration</p><p className="mt-1 text-[11px] text-[#a17673]">Let them make it theirs ✳</p></div>
                <div className="absolute left-[87px] top-[257px] flex h-[88px] w-[145px] items-center justify-center rounded-full border-2 border-dashed border-[#efaaa0] text-center text-[12px] font-semibold leading-5 text-[#9c5850]">skip the<br />long form?</div>
                <div className="absolute left-[238px] top-[238px] flex h-8 items-center gap-2 rounded-full border border-white bg-white px-2.5 shadow-lg"><span className="h-5 w-5 rounded-full bg-[#f4b9a7]"/><span className="text-[9px] font-semibold text-[#686472]">Jules is sketching</span></div>
                <div className="absolute bottom-[20px] left-[255px] flex items-center gap-1 rounded-xl border border-[#e9e5ed] bg-white p-1.5 shadow-lg">
                  {[MousePointer2, Pencil, Square, Circle, StickyNote].map((Icon, i) => <span key={i} className={`flex h-8 w-8 items-center justify-center rounded-lg ${i === 1 ? "bg-violet-100 text-violet-700" : "text-[#817d89]"}`}><Icon className="h-4 w-4" /></span>)}
                  <span className="mx-1 h-5 w-px bg-[#eeebf1]"/><span className="flex h-8 w-8 items-center justify-center rounded-lg text-[#817d89]"><Plus className="h-4 w-4" /></span>
                </div>
                <span className="absolute left-[302px] top-[191px] text-[10px] font-semibold text-violet-600">you</span>
                <span className="absolute left-[482px] top-[238px] text-[10px] font-semibold text-[#e18c72]">@ Jules</span>
              </div>
              <div className="absolute bottom-3 right-4 flex items-center gap-1 rounded-lg border border-[#ebe7ef] bg-white/90 px-2 py-1.5 text-[10px] text-[#898591]"><Command className="h-3 w-3" /> K</div>
            </div>
          </div>
          <div className="absolute -right-2 bottom-20 hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#f8d7a9] text-[#9c6c28] shadow-lg sm:flex"><ArrowUpRight className="h-5 w-5" /></div>
        </div>
      </section>

      <section id="features" className="border-y border-[#eeebf1] bg-white px-6 py-20 sm:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">The space between idea and done</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">A blank page, with your people already on it.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#77737f]">No ceremony. No perfect brief. Just a canvas that makes it easier to get the first thought out and build on it together.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description, color }) => <article key={title} className="rounded-2xl border border-[#eeebf1] bg-[#fdfcfe] p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-900/5"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3><p className="mt-2 text-sm leading-6 text-[#77737f]">{description}</p></article>)}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:px-12 lg:py-24">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Simple by design</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Start with a scribble. See where it goes.</h2><p className="mt-4 text-base leading-7 text-[#77737f]">Your team already has the ideas. SketchFlow gives them somewhere to meet.</p><Link href="/signup" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900">Make your first board <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="grid gap-3 sm:grid-cols-3">{[{ n: "01", title: "Make a space", body: "Give the idea a name and start with a blank board." }, { n: "02", title: "Get it out", body: "Draw the flow, add a note, connect the dots." }, { n: "03", title: "Bring people in", body: "Share your board and think through it together." }].map((step) => <div key={step.n} className="rounded-2xl border border-[#eae6ef] bg-white p-5"><span className="text-xs font-bold tracking-widest text-violet-500">{step.n}</span><h3 className="mt-7 text-base font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#77737f]">{step.body}</p></div>)}</div>
      </section>

      <section className="px-6 pb-20 sm:px-10 lg:px-12 lg:pb-24"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[28px] bg-[#282536] px-7 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:px-14 lg:py-12"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Your next idea starts here</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Make room for the messy middle.</h2></div><Link href="/signup" className="inline-flex h-12 shrink-0 items-center gap-3 rounded-xl bg-white px-5 text-sm font-semibold text-[#282536] transition hover:bg-violet-100">Create your free board <ArrowRight className="h-4 w-4" /></Link></div></section>
    </div>
  )
}
