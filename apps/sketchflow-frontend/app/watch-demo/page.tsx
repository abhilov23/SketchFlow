import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { Shapes, Play, Volume2, ChevronLeft, Maximize, CheckCircle2 } from "lucide-react";

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
  .btn-icon {
    background: transparent;
    color: white;
    transition: all 0.3s ease;
  }
  .btn-icon:hover {
    background: rgba(107, 114, 128, 0.2);
    transform: scale(1.1);
  }
  .btn-icon:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
`;

export default function WatchDemoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Add custom styles */}
      <style>{customStyles}</style>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float-subtle opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gray-400/20 rounded-full blur-3xl translate-x-1/2 animate-float-subtle opacity-30" style={{ animationDelay: "1s" }}></div>
      </div>

      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-gray-700/40 backdrop-blur-sm bg-gray-950/80 z-10 shadow-glow">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gray-500 flex items-center justify-center text-white shadow-glow hover-glow transition-all">
            <Shapes className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-white">
            SketchFlow
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Button className="btn-outline gap-2 flex justify-center" asChild>
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button className="btn-primary flex justify-center">
            Try Now
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold tracking-tighter text-white">
                SketchFlow Demo Video
              </h1>
              <p className="text-gray-300 md:text-lg">
                Watch how SketchFlow can transform your creative workflow
              </p>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-700/40 bg-gray-900 shadow-glow hover-glow transition-all duration-300">
              {/* Video player mockup */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gray-800/50 backdrop-blur-sm">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-gray-500/50 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-gray-500/70 transition-all duration-300 shadow-glow hover-glow">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-950/80 to-transparent px-4 flex items-center">
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="btn-icon h-8 w-8 *: flex justify-center">
                            <Play className="h-4 w-4" />
                          </Button>
                          <span className="text-xs text-gray-300">0:00 / 5:30</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="btn-icon h-8 w-8 flex justify-center">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="btn-icon h-8 w-8 flex justify-center">
                            <Maximize className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="w-full bg-gray-600/50 h-1 rounded-full overflow-hidden">
                        <div className="bg-gray-400 h-full w-1/3 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1">
                <TabsTrigger
                  value="overview"
                  className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white rounded-md transition-all duration-300"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white rounded-md transition-all duration-300"
                >
                  Key Features
                </TabsTrigger>
                <TabsTrigger
                  value="tutorial"
                  className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white rounded-md transition-all duration-300"
                >
                  Tutorial
                </TabsTrigger>
                <TabsTrigger
                  value="faq"
                  className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white rounded-md transition-all duration-300"
                >
                  FAQ
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3 p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm shadow-glow hover-glow transition-all duration-300">
                    <h3 className="text-xl font-bold text-white">What is SketchFlow?</h3>
                    <p className="text-gray-300">
                      SketchFlow is a collaborative whiteboard tool that helps teams visualize ideas, create diagrams,
                      and work together in real-time. Whether you're brainstorming, planning, or teaching, SketchFlow
                      provides the perfect canvas for your creativity.
                    </p>
                  </div>
                  <div className="space-y-3 p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm shadow-glow hover-glow transition-all duration-300">
                    <h3 className="text-xl font-bold text-white">Who is it for?</h3>
                    <p className="text-gray-300">
                      SketchFlow is designed for designers, developers, product managers, educators, and anyone who
                      needs to visualize ideas and collaborate with others. It's perfect for remote teams, classrooms,
                      and creative professionals.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="features" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Real-time Collaboration",
                      desc: "Work together with your team in real-time, no matter where they are.",
                    },
                    {
                      title: "Intuitive Drawing Tools",
                      desc: "Simple yet powerful drawing tools that feel natural and responsive.",
                    },
                    {
                      title: "Easy Sharing",
                      desc: "Share your creations with a simple link or export to various formats.",
                    },
                    { title: "Rich Library", desc: "Access a wide range of shapes, templates, and components." },
                    { title: "Version History", desc: "Track changes and revert to previous versions when needed." },
                    { title: "Cross-Platform", desc: "Use SketchFlow on any device with a web browser." },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex flex-col space-y-3 p-6 rounded-xl border border-gray-700/40 bg-gray-800/30 backdrop-blur-sm shadow-glow hover-glow transition-all duration-300"
                    >
                      <h3 className="text-lg font-bold flex items-center text-white">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-gray-400" />
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-300">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="tutorial" className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Getting Started</h3>
                    <ol className="space-y-6">
                      <li className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white shadow-glow">
                          1
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-medium text-white">Create a new board</h4>
                          <p className="text-gray-300">
                            Start with a blank canvas or choose from our templates.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white shadow-glow">
                          2
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-medium text-white">Draw and design</h4>
                          <p className="text-gray-300">
                            Use our intuitive tools to sketch, add shapes, text, and more.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white shadow-glow">
                          3
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-medium text-white">Collaborate with others</h4>
                          <p className="text-gray-300">
                            Invite team members to join and work together in real-time.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="faq" className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      q: "Is SketchFlow free to use?",
                      a: "SketchFlow offers a free tier with basic features. Premium features are available with paid plans.",
                    },
                    {
                      q: "Can I use SketchFlow offline?",
                      a: "Currently, SketchFlow requires an internet connection to use all features.",
                    },
                    {
                      q: "How many people can collaborate on a board?",
                      a: "Our standard plan allows up to 10 simultaneous collaborators, while our premium plans offer unlimited collaborators.",
                    },
                    { q: "Can I export my designs?", a: "Yes, you can export your designs as PNG, SVG, or PDF files." },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-xl border border-gray-700/40 bg-gray-800/30 backdrop-blur-sm shadow-glow hover-glow transition-all duration-300"
                    >
                      <h3 className="text-lg font-bold text-white">{item.q}</h3>
                      <p className="text-gray-300 mt-2">{item.a}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary flex justify-center">
                <Link href="/try-now">Try SketchFlow Now</Link>
              </Button>
              <Button className="btn-outline flex justify-center">
                <Link href="/signup">Sign Up for Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 md:px-6 border-t border-gray-700/40">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} SketchFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
              Privacy
            </Link>
            <Link href="/contact" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}