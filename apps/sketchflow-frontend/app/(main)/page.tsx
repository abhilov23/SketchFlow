"use client";

import { ArrowRight, Users, Share2, Download, Shapes, Palette, Zap, Play, CheckCircle, Layers, MousePointer2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: <Users className="h-7 w-7" />,
    title: "Real-time Collaboration",
    desc: "Work together with your team in real-time, no matter where they are. See changes as they happen with live cursors.",
    highlights: ["Live cursors", "Multi-user editing", "Instant sync"],
  },
  {
    icon: <Palette className="h-7 w-7" />,
    title: "Intuitive Drawing Tools",
    desc: "Simple yet powerful drawing tools that feel natural and responsive. From freehand to perfect shapes.",
    highlights: ["Freehand pencil", "Perfect shapes", "Smooth rendering"],
  },
  {
    icon: <Share2 className="h-7 w-7" />,
    title: "Easy Sharing",
    desc: "Share your board with a simple link. Anyone with the link can view and collaborate.",
    highlights: ["Copy board link", "Real-time collaboration", "Instant access"],
  },
  {
    icon: <Download className="h-7 w-7" />,
    title: "PNG Export",
    desc: "Export your canvas as a PNG image with a single click. Perfect for presentations and documentation.",
    highlights: ["One-click export", "High resolution", "Ready to share"],
  },
  {
    icon: <Shapes className="h-7 w-7" />,
    title: "Drawing Tools",
    desc: "A focused set of essential tools for freehand sketching, shapes, text, and annotations.",
    highlights: ["Pencil & eraser", "Line, rect, circle, diamond", "Text tool"],
  },
  {
    icon: <Zap className="h-7 w-7" />,
    title: "Lightweight & Fast",
    desc: "Optimized performance that works smoothly on any device. No heavy downloads or installations needed.",
    highlights: ["Browser-based", "Mobile friendly", "Instant load"],
  },
]

const steps = [
  {
    number: "01",
    title: "Create a new board",
    desc: "Start with a blank canvas or jump-start your work with a pre-built template tailored to your needs.",
    icon: <Layers className="h-6 w-6" />,
  },
  {
    number: "02",
    title: "Draw and design",
    desc: "Use our intuitive toolkit to sketch freehand, add perfect shapes, insert text, and build complex diagrams with ease.",
    icon: <MousePointer2 className="h-6 w-6" />,
  },
  {
    number: "03",
    title: "Collaborate in real-time",
    desc: "Invite your team members to join the board. Watch their cursors move as they draw, edit, and contribute alongside you.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    number: "04",
    title: "Share your creation",
    desc: "Export your finished board as a PNG image, or share a direct link so anyone can view it instantly.",
    icon: <Sparkles className="h-6 w-6" />,
  },
]

const testimonials = [
  {
    quote: "SketchFlow has completely transformed how our design team collaborates remotely. It's intuitive, incredibly fast, and has every feature we need for brainstorming and diagramming.",
    name: "Sarah Johnson",
    title: "Design Lead at TechCorp",
    initials: "SJ",
  },
  {
    quote: "We tried Miro, FigJam, and Excalidraw, but SketchFlow struck the perfect balance between simplicity and power. Our onboarding time dropped by 60%.",
    name: "Michael Chen",
    title: "Product Manager at RemoteWorks",
    initials: "MC",
  },
  {
    quote: "The export options and real-time collaboration make SketchFlow indispensable for our client workshops. We've replaced three different tools with this one platform.",
    name: "Emily Rodriguez",
    title: "Creative Director at DesignStudio",
    initials: "ER",
  },
]

const stats = [
  { value: "10K+", label: "Active users" },
  { value: "50K+", label: "Boards created" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "User rating" },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Now in public beta</span>
              <span className="ml-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Free</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Collaborate, Create,
              <br />
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Share Your Ideas</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl/relaxed">
              SketchFlow is a virtual whiteboard for sketching, diagramming, and collaborating in real-time with your
              team. No downloads, no setup, just pure creativity.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => router.push("/signup")}
                className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                Start Drawing Free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => router.push("/watch-demo")}
                className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-8 text-base font-semibold shadow-sm transition-all hover:bg-accent active:scale-[0.98]"
              >
                <Play className="h-4 w-4" /> Watch Demo
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Free forever tier</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Unlimited boards</span>
            </div>
          </div>

          {/* Preview mockup */}
          <div className="mx-auto mt-16 max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 rounded-full bg-destructive/80" />
                  <div className="h-3.5 w-3.5 rounded-full bg-amber-500/80" />
                  <div className="h-3.5 w-3.5 rounded-full bg-green-500/80" />
                </div>
                <div className="hidden rounded-md border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground sm:block">
                  sketchflow.app/board/demo-123
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary ring-2 ring-background">YK</div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-medium text-blue-500 ring-2 ring-background">AK</div>
                  <span className="ml-1 text-muted-foreground/60">2 online</span>
                </div>
              </div>
              <svg viewBox="0 0 800 480" className="block w-full" role="img" aria-label="SketchFlow whiteboard preview">
                <rect width="800" height="480" fill="oklch(0.145 0 0)" />
                <g>
                  <rect x="50" y="50" width="220" height="150" rx="10" fill="oklch(0.627 0.265 303.9 / 0.08)" stroke="oklch(0.627 0.265 303.9 / 0.5)" strokeWidth="2" />
                  <circle cx="75" cy="75" r="16" fill="oklch(0.627 0.265 303.9 / 0.2)" />
                  <text x="75" y="80" fill="oklch(0.627 0.265 303.9)" fontSize="14" fontFamily="sans-serif" textAnchor="middle" fontWeight="700">B</text>
                  <text x="100" y="80" fill="oklch(0.627 0.265 303.9)" fontSize="14" fontFamily="sans-serif" fontWeight="700">Brainstorm: Homepage</text>
                  <circle cx="75" cy="115" r="10" fill="oklch(0.546 0.245 262.881 / 0.2)" />
                  <text x="92" y="119" fill="oklch(0.546 0.245 262.881 / 0.9)" fontSize="12" fontFamily="sans-serif">Hero animation ideas</text>
                  <circle cx="75" cy="140" r="10" fill="oklch(0.723 0.219 149.579 / 0.2)" />
                  <text x="92" y="144" fill="oklch(0.723 0.219 149.579 / 0.9)" fontSize="12" fontFamily="sans-serif">Color palette options</text>
                  <circle cx="75" cy="165" r="10" fill="oklch(0.715 0.143 25.228 / 0.2)" />
                  <text x="92" y="169" fill="oklch(0.715 0.143 25.228 / 0.9)" fontSize="12" fontFamily="sans-serif">Layout wireframes</text>
                  <line x1="130" y1="100" x2="290" y2="100" stroke="oklch(0.715 0.143 25.228 / 0.3)" strokeWidth="1.5" strokeDasharray="5 3" />

                  <rect x="310" y="50" width="200" height="150" rx="10" fill="oklch(0.723 0.219 149.579 / 0.06)" stroke="oklch(0.723 0.219 149.579 / 0.4)" strokeWidth="2" />
                  <text x="330" y="80" fill="oklch(0.723 0.219 149.579)" fontSize="13" fontFamily="sans-serif" fontWeight="700">User Story</text>
                  <rect x="330" y="92" width="160" height="2" rx="1" fill="oklch(0.723 0.219 149.579 / 0.2)" />
                  <text x="330" y="112" fill="oklch(0.723 0.219 149.579 / 0.85)" fontSize="11" fontFamily="sans-serif">As a designer, I want</text>
                  <text x="330" y="128" fill="oklch(0.723 0.219 149.579 / 0.85)" fontSize="11" fontFamily="sans-serif">real-time collaboration</text>
                  <text x="330" y="144" fill="oklch(0.723 0.219 149.579 / 0.85)" fontSize="11" fontFamily="sans-serif">so I can co-create</text>
                  <text x="330" y="160" fill="oklch(0.723 0.219 149.579 / 0.85)" fontSize="11" fontFamily="sans-serif">with my team.</text>
                  <rect x="330" y="174" width="50" height="18" rx="4" fill="oklch(0.723 0.219 149.579 / 0.15)" />
                  <text x="338" y="186" fill="oklch(0.723 0.219 149.579 / 0.8)" fontSize="9" fontFamily="sans-serif">FEATURE</text>

                  <rect x="550" y="50" width="200" height="150" rx="10" fill="oklch(0.546 0.245 262.881 / 0.07)" stroke="oklch(0.546 0.245 262.881 / 0.4)" strokeWidth="2" />
                  <text x="570" y="80" fill="oklch(0.546 0.245 262.881)" fontSize="13" fontFamily="sans-serif" fontWeight="700">Tasks</text>
                  <rect x="570" y="92" width="160" height="2" rx="1" fill="oklch(0.546 0.245 262.881 / 0.2)" />
                  <rect x="570" y="104" width="14" height="14" rx="3" fill="oklch(0.546 0.245 262.881 / 0.15)" stroke="oklch(0.546 0.245 262.881 / 0.4)" strokeWidth="1.5" />
                  <text x="590" y="116" fill="oklch(0.546 0.245 262.881 / 0.85)" fontSize="11" fontFamily="sans-serif">Design system</text>
                  <rect x="570" y="124" width="14" height="14" rx="3" fill="oklch(0.546 0.245 262.881 / 0.15)" stroke="oklch(0.546 0.245 262.881 / 0.4)" strokeWidth="1.5" />
                  <text x="590" y="136" fill="oklch(0.546 0.245 262.881 / 0.85)" fontSize="11" fontFamily="sans-serif">API integration</text>
                  <rect x="570" y="144" width="14" height="14" rx="3" fill="oklch(0.627 0.265 303.9 / 0.25)" stroke="oklch(0.627 0.265 303.9 / 0.5)" strokeWidth="1.5" />
                  <text x="574" y="155" fill="oklch(0.627 0.265 303.9)" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="700">&#10003;</text>
                  <text x="590" y="156" fill="oklch(0.546 0.245 262.881 / 0.85)" fontSize="11" fontFamily="sans-serif">Auth module</text>
                  <line x1="530" y1="125" x2="545" y2="125" stroke="oklch(0.715 0.143 25.228 / 0.35)" strokeWidth="1.5" />
                  <polygon points="548,121 548,129 556,125" fill="oklch(0.715 0.143 25.228 / 0.35)" />

                  <rect x="50" y="240" width="480" height="200" rx="12" fill="oklch(0.627 0.265 303.9 / 0.04)" stroke="oklch(0.627 0.265 303.9 / 0.2)" strokeWidth="1.5" strokeDasharray="6 4" />
                  <text x="70" y="270" fill="oklch(0.627 0.265 303.9 / 0.8)" fontSize="12" fontFamily="sans-serif" fontWeight="600">User Flow</text>
                  <rect x="70" y="285" width="90" height="34" rx="6" fill="oklch(0.546 0.245 262.881 / 0.15)" stroke="oklch(0.546 0.245 262.881 / 0.4)" strokeWidth="1.5" />
                  <text x="82" y="306" fill="oklch(0.546 0.245 262.881 / 0.9)" fontSize="10" fontFamily="sans-serif">Open App</text>
                  <line x1="160" y1="302" x2="180" y2="302" stroke="oklch(0.715 0.143 25.228 / 0.35)" strokeWidth="1.5" />
                  <polygon points="183,298 183,306 191,302" fill="oklch(0.715 0.143 25.228 / 0.35)" />
                  <rect x="195" y="285" width="90" height="34" rx="6" fill="oklch(0.627 0.265 303.9 / 0.15)" stroke="oklch(0.627 0.265 303.9 / 0.4)" strokeWidth="1.5" />
                  <text x="212" y="306" fill="oklch(0.627 0.265 303.9 / 0.9)" fontSize="10" fontFamily="sans-serif">Sign In</text>
                  <line x1="285" y1="302" x2="305" y2="302" stroke="oklch(0.715 0.143 25.228 / 0.35)" strokeWidth="1.5" />
                  <polygon points="308,298 308,306 316,302" fill="oklch(0.715 0.143 25.228 / 0.35)" />
                  <rect x="320" y="285" width="90" height="34" rx="6" fill="oklch(0.723 0.219 149.579 / 0.15)" stroke="oklch(0.723 0.219 149.579 / 0.4)" strokeWidth="1.5" />
                  <text x="337" y="306" fill="oklch(0.723 0.219 149.579 / 0.9)" fontSize="10" fontFamily="sans-serif">New Board</text>
                  <line x1="410" y1="302" x2="430" y2="302" stroke="oklch(0.715 0.143 25.228 / 0.35)" strokeWidth="1.5" />
                  <polygon points="433,298 433,306 441,302" fill="oklch(0.715 0.143 25.228 / 0.35)" />
                  <rect x="445" y="285" width="70" height="34" rx="6" fill="oklch(0.715 0.143 25.228 / 0.15)" stroke="oklch(0.715 0.143 25.228 / 0.4)" strokeWidth="1.5" />
                  <text x="459" y="306" fill="oklch(0.715 0.143 25.228 / 0.9)" fontSize="10" fontFamily="sans-serif">Draw</text>

                  <rect x="70" y="340" width="140" height="34" rx="6" fill="oklch(0.546 0.245 262.881 / 0.12)" stroke="oklch(0.546 0.245 262.881 / 0.3)" strokeWidth="1.5" />
                  <text x="85" y="361" fill="oklch(0.546 0.245 262.881 / 0.8)" fontSize="10" fontFamily="sans-serif">Add collaborators</text>
                  <line x1="210" y1="357" x2="230" y2="357" stroke="oklch(0.715 0.143 25.228 / 0.35)" strokeWidth="1.5" />
                  <polygon points="233,353 233,361 241,357" fill="oklch(0.715 0.143 25.228 / 0.35)" />
                  <rect x="245" y="340" width="130" height="34" rx="6" fill="oklch(0.723 0.219 149.579 / 0.12)" stroke="oklch(0.723 0.219 149.579 / 0.3)" strokeWidth="1.5" />
                  <text x="263" y="361" fill="oklch(0.723 0.219 149.579 / 0.8)" fontSize="10" fontFamily="sans-serif">Real-time edit</text>
                  <line x1="375" y1="357" x2="395" y2="357" stroke="oklch(0.715 0.143 25.228 / 0.35)" strokeWidth="1.5" />
                  <polygon points="398,353 398,361 406,357" fill="oklch(0.715 0.143 25.228 / 0.35)" />
                  <rect x="410" y="340" width="105" height="34" rx="6" fill="oklch(0.627 0.265 303.9 / 0.12)" stroke="oklch(0.627 0.265 303.9 / 0.3)" strokeWidth="1.5" />
                  <text x="425" y="361" fill="oklch(0.627 0.265 303.9 / 0.8)" fontSize="10" fontFamily="sans-serif">Export & share</text>

                  <rect x="560" y="240" width="190" height="200" rx="12" fill="oklch(0.715 0.143 25.228 / 0.05)" stroke="oklch(0.715 0.143 25.228 / 0.25)" strokeWidth="1.5" />
                  <rect x="580" y="260" width="150" height="80" rx="6" fill="oklch(0.546 0.245 262.881 / 0.12)" stroke="oklch(0.546 0.245 262.881 / 0.3)" strokeWidth="1.5" />
                  <rect x="590" y="270" width="60" height="30" rx="4" fill="oklch(0.627 0.265 303.9 / 0.2)" stroke="oklch(0.627 0.265 303.9 / 0.4)" strokeWidth="1" />
                  <text x="596" y="289" fill="oklch(0.627 0.265 303.9 / 0.8)" fontSize="9" fontFamily="sans-serif" fontWeight="600">Canvas</text>
                  <line x1="650" y1="285" x2="665" y2="285" stroke="oklch(0.715 0.143 25.228 / 0.3)" strokeWidth="1" />
                  <rect x="668" y="270" width="50" height="30" rx="4" fill="oklch(0.723 0.219 149.579 / 0.2)" stroke="oklch(0.723 0.219 149.579 / 0.4)" strokeWidth="1" />
                  <text x="674" y="289" fill="oklch(0.723 0.219 149.579 / 0.8)" fontSize="9" fontFamily="sans-serif" fontWeight="600">Tools</text>
                  <line x1="590" y1="308" x2="720" y2="308" stroke="oklch(0.715 0.143 25.228 / 0.2)" strokeWidth="1" />
                  <text x="590" y="326" fill="oklch(0.546 0.245 262.881 / 0.7)" fontSize="10" fontFamily="sans-serif">Drop elements here</text>
                  <rect x="580" y="360" width="150" height="60" rx="6" fill="oklch(0.723 0.219 149.579 / 0.08)" stroke="oklch(0.723 0.219 149.579 / 0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="630" y="385" fill="oklch(0.723 0.219 149.579 / 0.5)" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Upload files</text>
                  <text x="630" y="400" fill="oklch(0.723 0.219 149.579 / 0.35)" fontSize="9" fontFamily="sans-serif" textAnchor="middle">or drag & drop</text>

                  <rect x="50" y="450" width="52" height="22" rx="4" fill="oklch(0.723 0.219 149.579 / 0.12)" />
                  <text x="57" y="464" fill="oklch(0.723 0.219 149.579 / 0.8)" fontSize="9" fontFamily="sans-serif">pencil</text>
                  <rect x="108" y="450" width="42" height="22" rx="4" fill="oklch(0.546 0.245 262.881 / 0.12)" />
                  <text x="115" y="464" fill="oklch(0.546 0.245 262.881 / 0.8)" fontSize="9" fontFamily="sans-serif">rect</text>
                  <rect x="156" y="450" width="38" height="22" rx="4" fill="oklch(0.627 0.265 303.9 / 0.12)" />
                  <text x="163" y="464" fill="oklch(0.627 0.265 303.9 / 0.8)" fontSize="9" fontFamily="sans-serif">text</text>
                  <rect x="200" y="450" width="50" height="22" rx="4" fill="oklch(0.715 0.143 25.228 / 0.12)" />
                  <text x="207" y="464" fill="oklch(0.715 0.143 25.228 / 0.8)" fontSize="9" fontFamily="sans-serif">eraser</text>

                  <g transform="translate(700, 50)">
                    <rect x="0" y="0" width="26" height="26" rx="6" fill="oklch(0.627 0.265 303.9 / 0.12)" stroke="oklch(0.627 0.265 303.9 / 0.3)" strokeWidth="1" />
                    <line x1="6" y1="13" x2="20" y2="13" stroke="oklch(0.627 0.265 303.9 / 0.8)" strokeWidth="1.5" />
                    <line x1="13" y1="6" x2="13" y2="20" stroke="oklch(0.627 0.265 303.9 / 0.8)" strokeWidth="1.5" />
                  </g>
                  <g transform="translate(732, 50)">
                    <rect x="0" y="0" width="26" height="26" rx="6" fill="oklch(0.723 0.219 149.579 / 0.12)" stroke="oklch(0.723 0.219 149.579 / 0.3)" strokeWidth="1" />
                    <text x="13" y="17" fill="oklch(0.723 0.219 149.579 / 0.8)" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">+</text>
                  </g>
                  <g transform="translate(764, 50)">
                    <rect x="0" y="0" width="26" height="26" rx="6" fill="oklch(0.546 0.245 262.881 / 0.12)" stroke="oklch(0.546 0.245 262.881 / 0.3)" strokeWidth="1" />
                    <text x="13" y="17" fill="oklch(0.546 0.245 262.881 / 0.8)" fontSize="13" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">&ndash;</text>
                  </g>

                  <rect x="740" y="450" width="44" height="22" rx="4" fill="oklch(0.627 0.265 303.9 / 0.12)" />
                  <text x="748" y="464" fill="oklch(0.627 0.265 303.9 / 0.7)" fontSize="9" fontFamily="sans-serif" fontWeight="600">100%</text>

                  <rect x="500" y="240" width="8" height="8" rx="2" fill="oklch(0.546 0.245 262.881 / 0.6)" />
                  <text x="512" y="247" fill="oklch(0.546 0.245 262.881 / 0.5)" fontSize="9" fontFamily="sans-serif">You</text>
                  <rect x="536" y="240" width="8" height="8" rx="2" fill="oklch(0.723 0.219 149.579 / 0.6)" />
                  <text x="548" y="247" fill="oklch(0.723 0.219 149.579 / 0.5)" fontSize="9" fontFamily="sans-serif">Alex</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/20">
        <div className="container">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="px-4 py-8 text-center md:px-8 md:py-10">
                <div className="text-3xl font-bold tracking-tight md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Features</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Everything you need to bring your ideas to life
            </h2>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              SketchFlow combines the simplicity of drawing with powerful collaboration features.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
                  {feature.icon}
                </div>
                <h3 className="mb-2.5 text-xl font-semibold">{feature.title}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">{feature.desc}</p>
                <ul className="space-y-1.5">
                  {feature.highlights.map((h, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-muted/20 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm shadow-sm">
              <MousePointer2 className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">How It Works</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Simple, powerful, and intuitive
            </h2>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Get started in seconds. No tutorials needed.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-bold text-muted-foreground/20">{step.number}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm shadow-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Testimonials</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Loved by teams worldwide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              See what teams are saying about SketchFlow.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="h-5 w-5 fill-amber-500 text-amber-500" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 flex-1 leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-4 border-t border-border pt-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-2 ring-border">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/20 py-20 md:py-28">
        <div className="container">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 shadow-lg md:px-16 md:py-20">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Ready to start creating?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Join thousands of teams who are already using SketchFlow to bring their ideas to life. Get started for
                free, no credit card required.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => router.push("/signup")}
                  className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                >
                  Get Started Free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => router.push("/watch-demo")}
                  className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-8 text-base font-semibold shadow-sm transition-all hover:bg-accent active:scale-[0.98]"
                >
                  <Play className="h-4 w-4" /> Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
