import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { Play, ChevronLeft, Layers, Palette, Users, Globe, CheckCircle, Sparkles, ArrowRight, Monitor, Smartphone, Shield } from "lucide-react"

const highlights = [
  { icon: <Layers className="h-5 w-5" />, title: "Multi-layer Canvas", desc: "Organize your ideas across multiple layers for complex diagrams and detailed illustrations." },
  { icon: <Palette className="h-5 w-5" />, title: "Rich Styling", desc: "Customize colors, fonts, stroke widths, and fill styles to match your brand perfectly." },
  { icon: <Users className="h-5 w-5" />, title: "Team Collaboration", desc: "Invite team members to edit in real-time with live cursor presence and instant sync." },
  { icon: <Globe className="h-5 w-5" />, title: "Cross-platform", desc: "Works seamlessly on desktop, tablet, and mobile browsers. No app installation needed." },
  { icon: <Monitor className="h-5 w-5" />, title: "Export & Share", desc: "Export as PNG, SVG, or PDF. Share via direct link with view or edit permissions." },
  { icon: <Shield className="h-5 w-5" />, title: "Enterprise Security", desc: "End-to-end encryption, SSO support, and SOC 2 compliance for enterprise teams." },
]

const tutorials = [
  { num: 1, title: "Create an Account", desc: "Sign up for free in under 30 seconds with your email or Google account." },
  { num: 2, title: "Create a New Board", desc: "Click 'New Board' from your dashboard or start from a pre-built template." },
  { num: 3, title: "Choose Your Tools", desc: "Use the toolbar to select shapes, freehand pencil, text tool, or eraser." },
  { num: 4, title: "Invite Collaborators", desc: "Share the board link with your team and watch their changes appear in real-time." },
]

const faqs = [
  { q: "Is SketchFlow free to use?", a: "Yes! SketchFlow offers a generous free tier with unlimited boards and real-time collaboration for up to 5 users. Pro plans with advanced features start at $8/month." },
  { q: "Can I export my drawings?", a: "Absolutely. You can export your boards as PNG, SVG, or PDF with just a few clicks. Pro users also get vector export and high-resolution options." },
  { q: "Do I need to create an account?", a: "Yes, you'll need a free account to save and share your boards. It takes less than a minute to sign up with your email or Google account." },
  { q: "Is there a mobile app?", a: "SketchFlow is fully responsive and works great on mobile browsers. Native iOS and Android apps are coming soon." },
  { q: "Can I use SketchFlow offline?", a: "Currently, SketchFlow requires an internet connection for real-time collaboration. Offline mode with local caching is on our roadmap." },
]

export default function WatchDemoPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-6xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Overview</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            See SketchFlow in Action
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Watch how teams use SketchFlow to collaborate in real-time, create stunning diagrams, and bring ideas to life.
          </p>
        </div>

        {/* Video placeholder */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded-full bg-destructive/80" />
              <div className="h-3.5 w-3.5 rounded-full bg-amber-500/80" />
              <div className="h-3.5 w-3.5 rounded-full bg-green-500/80" />
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">demo.mp4</span>
            <div className="flex items-center gap-1.5">
              <Play className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="group cursor-pointer text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25">
                <Play className="h-10 w-10 pl-0.5 text-primary transition-all group-hover:text-primary-foreground" />
              </div>
              <p className="text-lg font-medium">Watch the demo video</p>
              <p className="text-sm text-muted-foreground">2 min 34 sec</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-16">
          <TabsList className="mb-10 justify-center">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm md:p-10">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">What is SketchFlow?</h2>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                SketchFlow is a real-time collaborative whiteboard tool designed for teams who need to sketch, diagram, and
                brainstorm together. Whether you&apos;re a designer mapping out user flows, a developer planning architecture,
                or a product manager facilitating a workshop, SketchFlow provides everything you need.
              </p>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                Unlike traditional whiteboarding tools, SketchFlow is built for speed and simplicity. You can start drawing
                instantly without any setup, and your changes are synced across all connected users in real-time.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { stat: "50K+", label: "Active boards" },
                  { stat: "10K+", label: "Teams using it" },
                  { stat: "4.9/5", label: "Average rating" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{s.stat}</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  {h.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{h.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="tutorial" className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm md:p-10">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
                <Play className="h-3.5 w-3.5" /> Getting Started
              </div>
              <h2 className="mb-8 text-2xl font-bold md:text-3xl">Start collaborating in 4 simple steps</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {tutorials.map((s) => (
                  <div key={s.num} className="flex gap-5 rounded-xl border border-border bg-muted/30 p-5 transition-all hover:border-primary/30">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                      {s.num}
                    </div>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md md:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-sm font-bold">?</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{f.q}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center shadow-sm md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to give it a try?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Start sketching, diagramming, and collaborating in real-time. No credit card required.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
          >
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
