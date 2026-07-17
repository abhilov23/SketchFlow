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
    desc: "Share your creations with a simple link. Control access and permissions for your boards.",
    highlights: ["Link sharing", "Access control", "No sign-up required"],
  },
  {
    icon: <Download className="h-7 w-7" />,
    title: "Export Options",
    desc: "Export your drawings in multiple formats with just a few clicks. Perfect for presentations and documentation.",
    highlights: ["PNG export", "SVG export", "PDF export"],
  },
  {
    icon: <Shapes className="h-7 w-7" />,
    title: "Rich Shape Library",
    desc: "Access a wide range of shapes, templates, and components. Drag and drop to build complex diagrams fast.",
    highlights: ["Pre-built shapes", "Templates", "Drag & drop"],
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
    desc: "Export your finished board as PNG, SVG, or PDF, or share a direct link so anyone can view it instantly.",
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
                <rect x="0" y="0" width="800" height="480" fill="none" />
                <g transform="translate(0, 0)">
                  <rect x="120" y="60" width="200" height="140" rx="8" fill="none" stroke="oklch(0.627 0.265 303.9 / 0.6)" strokeWidth="2.5" />
                  <rect x="120" y="60" width="200" height="140" rx="8" fill="oklch(0.627 0.265 303.9 / 0.08)" />
                  <text x="160" y="110" fill="oklch(0.627 0.265 303.9)" fontSize="14" fontFamily="sans-serif" fontWeight="600">Q3 Roadmap</text>
                  <text x="160" y="135" fill="oklch(0.627 0.265 303.9 / 0.7)" fontSize="11" fontFamily="sans-serif">- Auth module</text>
                  <text x="160" y="152" fill="oklch(0.627 0.265 303.9 / 0.7)" fontSize="11" fontFamily="sans-serif">- API integration</text>
                  <text x="160" y="169" fill="oklch(0.627 0.265 303.9 / 0.7)" fontSize="11" fontFamily="sans-serif">- Dashboard</text>
                  <text x="160" y="186" fill="oklch(0.627 0.265 303.9 / 0.7)" fontSize="11" fontFamily="sans-serif">- Deployment</text>
                  <rect x="370" y="60" width="100" height="100" rx="6" fill="oklch(0.546 0.245 262.881 / 0.12)" stroke="oklch(0.546 0.245 262.881 / 0.5)" strokeWidth="2" />
                  <text x="390" y="105" fill="oklch(0.546 0.245 262.881)" fontSize="12" fontFamily="sans-serif" fontWeight="600">Wireframe</text>
                  <text x="390" y="125" fill="oklch(0.546 0.245 262.881 / 0.6)" fontSize="10" fontFamily="sans-serif">v2.1</text>
                  <circle cx="520" cy="110" r="40" fill="none" stroke="oklch(0.723 0.219 149.579 / 0.5)" strokeWidth="2.5" />
                  <circle cx="520" cy="110" r="40" fill="oklch(0.723 0.219 149.579 / 0.1)" />
                  <text x="505" y="116" fill="oklch(0.723 0.219 149.579)" fontSize="14" fontFamily="sans-serif" fontWeight="600">88%</text>
                  <text x="650" y="90" fill="none" stroke="oklch(0.715 0.143 25.228 / 0.5)" strokeWidth="2" strokeDasharray="6 4">
                    <tspan>Arrow</tspan>
                    <tspan x="650" y="130">flow</tspan>
                  </text>
                  <line x1="320" y1="130" x2="370" y2="110" stroke="oklch(0.715 0.143 25.228 / 0.4)" strokeWidth="1.5" strokeDasharray="5 3" />
                  <line x1="470" y1="110" x2="480" y2="110" stroke="oklch(0.715 0.143 25.228 / 0.4)" strokeWidth="1.5" />
                  <polygon points="485,105 485,115 495,110" fill="oklch(0.715 0.143 25.228 / 0.4)" />
                  <line x1="520" y1="150" x2="520" y2="220" stroke="oklch(0.715 0.143 25.228 / 0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <rect x="180" y="260" width="500" height="160" rx="12" fill="oklch(0.627 0.265 303.9 / 0.05)" stroke="oklch(0.627 0.265 303.9 / 0.25)" strokeWidth="1.5" strokeDasharray="6 4" />
                  <text x="210" y="295" fill="oklch(0.723 0.219 149.579)" fontSize="13" fontFamily="sans-serif" fontWeight="600">System Architecture</text>
                  <rect x="220" y="310" width="120" height="40" rx="6" fill="oklch(0.546 0.245 262.881 / 0.15)" stroke="oklch(0.546 0.245 262.881 / 0.4)" strokeWidth="1.5" />
                  <text x="235" y="335" fill="oklch(0.546 0.245 262.881)" fontSize="11" fontFamily="sans-serif">Frontend</text>
                  <line x1="340" y1="330" x2="370" y2="330" stroke="oklch(0.715 0.143 25.228 / 0.4)" strokeWidth="1.5" />
                  <polygon points="373,326 373,334 381,330" fill="oklch(0.715 0.143 25.228 / 0.4)" />
                  <rect x="385" y="310" width="120" height="40" rx="6" fill="oklch(0.627 0.265 303.9 / 0.15)" stroke="oklch(0.627 0.265 303.9 / 0.4)" strokeWidth="1.5" />
                  <text x="410" y="335" fill="oklch(0.627 0.265 303.9)" fontSize="11" fontFamily="sans-serif">API Gateway</text>
                  <line x1="505" y1="330" x2="535" y2="330" stroke="oklch(0.715 0.143 25.228 / 0.4)" strokeWidth="1.5" />
                  <polygon points="538,326 538,334 546,330" fill="oklch(0.715 0.143 25.228 / 0.4)" />
                  <rect x="550" y="310" width="120" height="40" rx="6" fill="oklch(0.723 0.219 149.579 / 0.15)" stroke="oklch(0.723 0.219 149.579 / 0.4)" strokeWidth="1.5" />
                  <text x="570" y="335" fill="oklch(0.723 0.219 149.579)" fontSize="11" fontFamily="sans-serif">Database</text>
                  <rect x="50" y="420" width="60" height="22" rx="4" fill="oklch(0.723 0.219 149.579 / 0.12)" />
                  <text x="56" y="434" fill="oklch(0.723 0.219 149.579)" fontSize="9" fontFamily="sans-serif">pencil</text>
                  <rect x="120" y="420" width="60" height="22" rx="4" fill="oklch(0.546 0.245 262.881 / 0.12)" />
                  <text x="126" y="434" fill="oklch(0.546 0.245 262.881)" fontSize="9" fontFamily="sans-serif">rect</text>
                  <rect x="190" y="420" width="60" height="22" rx="4" fill="oklch(0.627 0.265 303.9 / 0.12)" />
                  <text x="196" y="434" fill="oklch(0.627 0.265 303.9)" fontSize="9" fontFamily="sans-serif">text</text>
                  <rect x="260" y="420" width="60" height="22" rx="4" fill="oklch(0.715 0.143 25.228 / 0.12)" />
                  <text x="266" y="434" fill="oklch(0.715 0.143 25.228)" fontSize="9" fontFamily="sans-serif">eraser</text>
                  <g transform="translate(670, 56)">
                    <rect x="0" y="0" width="28" height="28" rx="6" fill="oklch(0.627 0.265 303.9 / 0.12)" stroke="oklch(0.627 0.265 303.9 / 0.3)" strokeWidth="1" />
                    <line x1="7" y1="14" x2="21" y2="14" stroke="oklch(0.627 0.265 303.9)" strokeWidth="1.5" />
                    <line x1="14" y1="7" x2="14" y2="21" stroke="oklch(0.627 0.265 303.9)" strokeWidth="1.5" />
                  </g>
                  <g transform="translate(702, 56)">
                    <rect x="0" y="0" width="28" height="28" rx="6" fill="oklch(0.723 0.219 149.579 / 0.12)" stroke="oklch(0.723 0.219 149.579 / 0.3)" strokeWidth="1" />
                    <text x="14" y="18" fill="oklch(0.723 0.219 149.579)" fontSize="12" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">+</text>
                  </g>
                  <g transform="translate(734, 56)">
                    <rect x="0" y="0" width="28" height="28" rx="6" fill="oklch(0.546 0.245 262.881 / 0.12)" stroke="oklch(0.546 0.245 262.881 / 0.3)" strokeWidth="1" />
                    <text x="14" y="18" fill="oklch(0.546 0.245 262.881)" fontSize="14" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">&ndash;</text>
                  </g>
                  <rect x="740" y="420" width="40" height="22" rx="4" fill="oklch(0.627 0.265 303.9 / 0.15)" />
                  <text x="746" y="434" fill="oklch(0.627 0.265 303.9 / 0.8)" fontSize="9" fontFamily="sans-serif" fontWeight="600">100%</text>
                  <rect x="400" y="250" width="8" height="8" rx="2" fill="oklch(0.546 0.245 262.881 / 0.6)" />
                  <text x="412" y="257" fill="oklch(0.546 0.245 262.881 / 0.5)" fontSize="9" fontFamily="sans-serif">You</text>
                  <rect x="450" y="250" width="8" height="8" rx="2" fill="oklch(0.723 0.219 149.579 / 0.6)" />
                  <text x="462" y="257" fill="oklch(0.723 0.219 149.579 / 0.5)" fontSize="9" fontFamily="sans-serif">Alex</text>
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
