import Link from "next/link";
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
} from "lucide-react";

const features = [
  {
    icon: Pencil,
    number: "01",
    title: "Get the first thought out",
    description:
      "Start with a rough sketch, a half-formed question, or the shape of an idea.",
  },
  {
    icon: Users,
    number: "02",
    title: "Make it better together",
    description:
      "Bring your team into one shared space to map, discuss, and build on the work.",
  },
  {
    icon: Share2,
    number: "03",
    title: "Keep the thinking moving",
    description:
      "Give every idea a home you can return to, share, and keep shaping over time.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create a board",
    description: "Name the idea and open up a space to think.",
  },
  {
    number: "02",
    title: "Sketch it out",
    description: "Draw a flow, leave a note, and connect what matters.",
  },
  {
    number: "03",
    title: "Share the canvas",
    description: "Invite people into the process and keep building.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-white text-[#191821]">
      <section className="relative isolate overflow-hidden bg-[#171620] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.19) 0.7px, transparent 0.7px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -right-48 -top-56 h-[620px] w-[620px] rounded-full bg-violet-600/25 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-72 left-[14%] h-[460px] w-[460px] rounded-full bg-indigo-500/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-16 sm:px-10 sm:pb-24 lg:min-h-[680px] lg:grid-cols-[0.83fr_1.17fr] lg:gap-8 lg:px-12 lg:py-24">
          <div className="relative z-10 max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-white/75 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />A shared
              canvas for your next big idea
            </div>
            <h1 className="text-[3.35rem] font-semibold leading-[0.99] tracking-[-0.065em] sm:text-6xl lg:text-[4.45rem]">
              Give good ideas room to{" "}
              <span className="text-violet-300">take shape.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              SketchFlow is a collaborative whiteboard for the messy, brilliant
              middle between a first thought and a real plan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center gap-3 rounded-xl bg-white px-5 text-sm font-semibold text-[#211f2b] shadow-[0_8px_32px_-12px_rgba(255,255,255,.35)] transition hover:-translate-y-0.5 hover:bg-violet-100"
              >
                Start sketching{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/watch-demo"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.08]"
              >
                Explore the canvas <ArrowDownRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/45">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />{" "}
                Make a board in seconds
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />{" "}
                Sketch, share, keep going
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[720px] lg:ml-auto">
            <div className="absolute -right-5 -top-7 z-10 hidden rotate-3 rounded-xl border border-[#eed6ac]/70 bg-[#fff4d8] px-4 py-3 text-xs font-semibold text-[#57472b] shadow-xl shadow-black/20 sm:block">
              What if we start here?
            </div>
            <div className="absolute -bottom-5 -left-4 z-10 hidden -rotate-2 rounded-xl border border-violet-200/60 bg-[#f2efff] px-4 py-3 text-xs font-semibold text-[#5e50a2] shadow-xl shadow-black/20 sm:block">
              Aha. That’s the shape of it.
            </div>
            <div className="rounded-[24px] border border-white/15 bg-white/[0.08] p-2.5 shadow-[0_40px_120px_-35px_rgba(0,0,0,.7)] backdrop-blur-sm sm:p-3">
              <div className="overflow-hidden rounded-[16px] bg-white shadow-2xl">
                <div className="flex h-12 items-center justify-between border-b border-[#efedf2] px-4 sm:px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                      <Shapes className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#373440]">
                        Launch ideas
                      </p>
                      <p className="text-[9px] text-[#a19daa]">
                        A space to figure it out
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="hidden -space-x-1.5 sm:flex">
                      <span className="h-6 w-6 rounded-full border-2 border-white bg-[#f0ad98]" />
                      <span className="h-6 w-6 rounded-full border-2 border-white bg-[#b9b0f1]" />
                      <span className="h-6 w-6 rounded-full border-2 border-white bg-[#a9d2ba]" />
                    </div>
                    <button className="flex h-7 items-center gap-1.5 rounded-lg bg-[#292638] px-2.5 text-[10px] font-semibold text-white">
                      <Share2 className="h-3 w-3" /> Share
                    </button>
                  </div>
                </div>
                <div className="relative h-[310px] overflow-hidden bg-[#faf9fc] sm:h-[400px]">
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      backgroundImage:
                        "radial-gradient(#d9d4e2 0.8px, transparent 0.8px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                  <div className="absolute left-1/2 top-1/2 h-[440px] w-[660px] -translate-x-1/2 -translate-y-1/2 scale-[0.5] sm:scale-[0.72] lg:scale-[0.84]">
                    <div className="absolute left-[42px] top-[57px] -rotate-6 rounded-xl border border-[#eed6ac] bg-[#fff4d8] px-5 py-4 shadow-lg shadow-[#58421a]/10">
                      <p className="text-[13px] font-semibold text-[#57472b]">
                        What are we solving?
                      </p>
                      <p className="mt-1 text-[11px] text-[#8d7b58]">
                        Make onboarding feel human
                      </p>
                    </div>
                    <div className="absolute left-[278px] top-[79px] flex h-[86px] w-[150px] items-center justify-center rounded-[22px] border-2 border-violet-300 bg-violet-50 text-center text-[13px] font-semibold leading-5 text-violet-800">
                      A warmer
                      <br />
                      welcome
                    </div>
                    <svg
                      className="absolute left-[177px] top-[93px] h-[70px] w-[110px] overflow-visible"
                      viewBox="0 0 110 70"
                    >
                      <path
                        d="M4 36 C40 4 70 65 100 33"
                        fill="none"
                        stroke="#8a7ce0"
                        strokeWidth="2.5"
                        strokeDasharray="5 5"
                      />
                      <path
                        d="m94 26 10 7-10 7"
                        fill="none"
                        stroke="#8a7ce0"
                        strokeWidth="2.5"
                      />
                    </svg>
                    <div className="absolute left-[482px] top-[68px] rotate-3 rounded-xl border border-[#cce5d6] bg-[#e9f8ef] px-5 py-4 shadow-lg shadow-[#31563e]/10">
                      <p className="text-[12px] font-semibold text-[#385f47]">
                        First five minutes
                      </p>
                      <p className="mt-2 text-[11px] leading-5 text-[#53725e]">
                        Say hello
                        <br />
                        Show one small win
                      </p>
                    </div>
                    <svg
                      className="absolute left-[337px] top-[177px] h-[105px] w-[100px]"
                      viewBox="0 0 100 115"
                    >
                      <path
                        d="M50 2 C90 28 87 70 50 105"
                        fill="none"
                        stroke="#e49a80"
                        strokeWidth="2.5"
                      />
                      <path
                        d="m41 98 9 10 5-12"
                        fill="none"
                        stroke="#e49a80"
                        strokeWidth="2.5"
                      />
                    </svg>
                    <div className="absolute left-[288px] top-[270px] rotate-2 rounded-xl border border-[#f1d4d1] bg-[#fff0ef] px-5 py-4 shadow-lg shadow-[#854d4a]/10">
                      <p className="text-[12px] font-semibold text-[#854d4a]">
                        Tiny celebration
                      </p>
                      <p className="mt-1 text-[11px] text-[#a17673]">
                        Let them make it theirs
                      </p>
                    </div>
                    <div className="absolute left-[55px] top-[237px] flex h-[82px] w-[140px] items-center justify-center rounded-full border-2 border-dashed border-[#efaaa0] text-center text-[12px] font-semibold leading-5 text-[#9c5850]">
                      Skip the
                      <br />
                      long form?
                    </div>
                    <div className="absolute left-[201px] top-[211px] flex h-8 items-center gap-2 rounded-full border border-[#eeeaf1] bg-white px-2.5 shadow-lg">
                      <span className="h-5 w-5 rounded-full bg-[#f0ad98]" />
                      <span className="text-[9px] font-semibold text-[#686472]">
                        Jules is sketching
                      </span>
                    </div>
                    <div className="absolute bottom-[18px] left-[192px] flex items-center gap-1 rounded-xl border border-[#e9e5ed] bg-white p-1.5 shadow-xl shadow-[#302b3b]/10">
                      {[MousePointer2, Pencil, Square, Circle, StickyNote].map(
                        (Icon, index) => (
                          <span
                            key={index}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${index === 1 ? "bg-violet-100 text-violet-700" : "text-[#817d89]"}`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                        ),
                      )}
                      <span className="mx-1 h-5 w-px bg-[#eeebf1]" />
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[#817d89]">
                        <Plus className="h-4 w-4" />
                      </span>
                    </div>
                    <span className="absolute left-[258px] top-[169px] text-[10px] font-semibold text-violet-600">
                      you
                    </span>
                    <span className="absolute left-[443px] top-[211px] text-[10px] font-semibold text-[#e18c72]">
                      @ Jules
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-4 flex items-center gap-1 rounded-lg border border-[#ebe7ef] bg-white/90 px-2 py-1.5 text-[10px] text-[#898591] shadow-sm">
                    <Command className="h-3 w-3" /> K
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-3 bottom-16 hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-violet-300 text-violet-950 shadow-xl sm:flex">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="h-px bg-white/10" />
          <div className="flex flex-wrap items-center justify-between gap-3 py-5 text-[11px] font-medium uppercase tracking-[0.13em] text-white/35">
            <span>One canvas</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
            <span>Many directions</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
            <span>Better ideas, together</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
            <span>Room to figure it out</span>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-700">
                A better place to begin
              </p>
              <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-4xl">
                Less pressure to be perfect. More room to make progress.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#777481] lg:justify-self-end lg:text-base">
              The best ideas rarely arrive fully formed. SketchFlow gives your
              team a flexible space to get the rough version down and discover
              what it could become.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map(({ number, title, description, icon: Icon }) => (
              <article
                key={number}
                className="group rounded-2xl border border-[#ebe9ef] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_24px_60px_-35px_rgba(74,58,140,.24)] sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f0ff] text-violet-700 transition group-hover:bg-violet-700 group-hover:text-white">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <span className="font-mono text-xs text-[#aaa7b1]">
                    {number}
                  </span>
                </div>
                <h3 className="mt-8 text-base font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#777481]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-[#eeecf1] bg-[#f8f7fa] px-6 py-20 sm:px-10 lg:px-12 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-700">
              Simple by design
            </p>
            <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-4xl">
              Start with a scribble. See where it goes.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#777481]">
              No elaborate setup. Just make a board, put the thought down, and
              bring in the people who can help it grow.
            </p>
            <Link
              href="/signup"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
            >
              Make your first board <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-[#ebe9ef] bg-white p-5 shadow-[0_8px_24px_-20px_rgba(38,34,54,.28)]"
              >
                <span className="font-mono text-xs font-semibold text-violet-700">
                  {step.number}
                </span>
                <h3 className="mt-8 text-sm font-semibold tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#777481]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 overflow-hidden rounded-[28px] bg-[#211f2c] px-7 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:px-14 lg:py-12">
          <div className="pointer-events-none absolute -right-20 -top-40 h-80 w-80 rounded-full bg-violet-500/25 blur-[90px]" />
          <div className="relative">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300">
              <Sparkles className="h-3.5 w-3.5" /> Your next idea starts here
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.045em] sm:text-3xl">
              Make a little room for the messy middle.
            </h2>
          </div>
          <Link
            href="/signup"
            className="group relative inline-flex h-12 shrink-0 items-center gap-3 rounded-xl bg-white px-5 text-sm font-semibold text-[#292638] transition hover:-translate-y-0.5 hover:bg-violet-100"
          >
            Create your free board{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
