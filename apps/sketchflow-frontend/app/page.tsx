"use client";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { ArrowRight, Users, Share2, Download, Shapes, Palette, Zap } from "lucide-react";
import { useRouter } from "next/navigation";


// Custom CSS for glow, animations, and button styles
const customStyles = `
  .shadow-glow {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }
  .hover-glow:hover {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
  .animate-float-subtle {
    animation: floatSubtle 6s ease-in-out infinite;
  }
  @keyframes floatSubtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-pulse-glow {
    animation: pulseGlow 3s ease-in-out infinite;
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.1); }
    50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.2); }
  }
  .btn-primary {
    background: linear-gradient(90deg, #6b7280, #4b5563);
    color: white;
    font-weight: 600;
    letter-spacing: 0.025em;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
  }
  .btn-primary:hover {
    background: linear-gradient(90deg, #4b5563, #374151);
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
  .btn-primary:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
  .btn-primary:active {
    transform: scale(0.95);
  }
  .btn-outline {
    border: 2px solid #6b7280;
    color: white;
    font-weight: 600;
    letter-spacing: 0.025em;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    background: transparent;
    transition: all 0.3s ease;
  }
  .btn-outline:hover {
    background: rgba(107, 114, 128, 0.2);
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
  .btn-outline:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
  .btn-outline:active {
    transform: scale(0.95);
  }
`;

export default function LandingPage() {
  const router = useRouter();


  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gray-950 text-white">
      {/* Add custom styles */}
      <style>{customStyles}</style>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float-subtle opacity-30"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gray-400/20 rounded-full blur-3xl translate-x-1/2 animate-float-subtle opacity-30" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gray-300/20 rounded-full blur-3xl animate-float-subtle opacity-30" style={{ animationDelay: "2s" }}></div>
      </div>

      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-gray-700/40 backdrop-blur-sm bg-gray-950/80 z-10 shadow-glow">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gray-500 flex items-center justify-center text-white shadow-glow hover-glow transition-all">
            <Shapes className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-white">
            SketchFlow
          </span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
          >
            Testimonials
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300">
            Log In
          </Link>
          <Button onClick={() => router.push("/signup")} className="btn-primary flex justify-between">
            Try Now
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white leading-tight">
                    Collaborate, Create, and Share Your Ideas
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl leading-relaxed">
                    SketchFlow is a virtual whiteboard for sketching, diagramming, and collaborating in real-time.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button className="btn-primary gap-2 flex justify-center">
                    Start Drawing <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => router.push("/watch-demo")}  className="btn-outline  flex justify-center">
                    Watch Demo
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[600px] lg:order-last">
                <div className="aspect-video rounded-xl overflow-hidden relative shadow-glow hover-glow transition-all duration-300">
                  <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4 p-6 w-full max-w-md">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-16 rounded-lg ${
                            i % 3 === 0 ? "bg-gray-600/60" : i % 3 === 1 ? "bg-gray-500/60" : "bg-gray-400/60"
                          } backdrop-blur-md animate-float-subtle hover:scale-105 transition-transform duration-300`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-400/10 rounded-full blur-3xl animate-pulse-glow"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3">
                <div className="inline-block rounded-full bg-gray-500 px-4 py-1.5 text-sm text-white font-medium shadow-glow">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Everything you need to bring your ideas to life
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SketchFlow combines the simplicity of drawing with powerful collaboration features.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Real-time Collaboration",
                  desc: "Work together with your team in real-time, no matter where they are.",
                },
                {
                  icon: <Palette className="h-6 w-6" />,
                  title: "Intuitive Drawing Tools",
                  desc: "Simple yet powerful drawing tools that feel natural and responsive.",
                },
                {
                  icon: <Share2 className="h-6 w-6" />,
                  title: "Easy Sharing",
                  desc: "Share your creations with a simple link or export to various formats.",
                },
                {
                  icon: <Download className="h-6 w-6" />,
                  title: "Export Options",
                  desc: "Export your drawings as PNG, SVG, or PDF with just a few clicks.",
                },
                {
                  icon: <Shapes className="h-6 w-6" />,
                  title: "Rich Library",
                  desc: "Access a wide range of shapes, templates, and components.",
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Lightweight & Fast",
                  desc: "Optimized performance that works smoothly on any device.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-center space-y-4 group p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm shadow-glow hover-glow transition-all duration-300"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gray-500 text-white group-hover:scale-110 transition-transform duration-300 shadow-glow`}
                  >
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-gray-950"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3">
                <div className="inline-block rounded-full bg-gray-500 px-4 py-1.5 text-sm text-white font-medium shadow-glow">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Simple, powerful, and intuitive
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SketchFlow is designed to be easy to use while providing all the tools you need.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="mx-auto w-full max-w-[600px]">
                <div className="aspect-video rounded-xl overflow-hidden relative bg-gray-900/50 p-8 border border-gray-700/40 shadow-glow hover-glow transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full flex flex-col">
                      <div className="h-8 w-full bg-gray-800/40 rounded-t-lg flex items-center px-4 gap-2">
                        <div className="h-3 w-3 rounded-full bg-gray-600"></div>
                        <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                        <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                      </div>
                      <div className="flex-1 grid grid-cols-4 grid-rows-4 gap-2 p-4 bg-gray-800/30 rounded-b-lg">
                        {[...Array(16)].map((_, i) => (
                          <div
                            key={i}
                            className={`rounded ${
                              i % 4 === 0
                                ? "bg-gray-600/40"
                                : i % 4 === 1
                                ? "bg-gray-500/40"
                                : i % 4 === 2
                                ? "bg-gray-400/40"
                                : "bg-gray-300/40"
                            } hover:scale-105 transition-transform duration-300`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  {[
                    {
                      step: 1,
                      title: "Create a new board",
                      desc: "Start with a blank canvas or choose from our templates.",
                    },
                    {
                      step: 2,
                      title: "Draw and design",
                      desc: "Use our intuitive tools to sketch, add shapes, text, and more.",
                    },
                    {
                      step: 3,
                      title: "Collaborate with others",
                      desc: "Invite team members to join and work together in real-time.",
                    },
                    {
                      step: 4,
                      title: "Share your creation",
                      desc: "Export or share your work with a simple link.",
                    },
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-4 group">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white group-hover:scale-110 transition-transform duration-300 shadow-glow`}
                      >
                        {step.step}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                        <p className="text-gray-300">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 relative">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gray-400/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gray-500/10 rounded-full blur-3xl animate-pulse-glow"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3">
                <div className="inline-block rounded-full bg-gray-500 px-4 py-1.5 text-sm text-white font-medium shadow-glow">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Loved by teams worldwide
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what others are saying about SketchFlow.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  quote:
                    "SketchFlow has transformed how our design team collaborates. It's intuitive, fast, and has all the features we need.",
                  name: "Sarah Johnson",
                  title: "Design Lead at TechCorp",
                },
                {
                  quote:
                    "As a remote team, we needed a tool that makes collaboration easy. SketchFlow is exactly what we were looking for.",
                  name: "Michael Chen",
                  title: "Product Manager at RemoteWorks",
                },
                {
                  quote:
                    "The export options and sharing capabilities make SketchFlow perfect for our client presentations.",
                  name: "Emily Rodriguez",
                  title: "Creative Director at DesignStudio",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between space-y-4 rounded-xl border border-gray-700/40 bg-gray-800/30 backdrop-blur-sm p-6 shadow-glow hover-glow transition-all duration-300"
                >
                  <div className="space-y-2">
                    <div className="h-8 w-8 rounded-full bg-gray-500/30 mb-2"></div>
                    <p className="text-gray-300">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-gray-500/40 h-10 w-10 group-hover:scale-110 transition-transform duration-300"></div>
                    <div>
                      <p className="text-sm font-medium text-white">{testimonial.name}</p>
                      <p className="text-xs text-gray-400">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/50"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl animate-pulse-glow"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Ready to start creating?
                </h2>
                <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of teams who are already using SketchFlow to bring their ideas to life.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button className="btn-primary gap-2  flex justify-center">
                  Get Started for Free
                </Button>
                <Button className="btn-outline  flex justify-center">
                  See Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700/40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gray-500 flex items-center justify-center text-white shadow-glow hover-glow transition-all">
            <Shapes className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-white">
            SketchFlow
          </span>
        </div>
        <p className="text-xs text-gray-400 sm:ml-auto">
          © {new Date().getFullYear()} SketchFlow. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
            Terms
          </Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
            Privacy
          </Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}