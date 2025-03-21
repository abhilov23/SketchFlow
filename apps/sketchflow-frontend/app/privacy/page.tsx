import Link from "next/link";
import { Shapes } from "lucide-react";
// Custom CSS (same as above, reused for consistency)
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

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Add custom styles */}
      <style>{customStyles}</style>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float-subtle opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gray-400/20 rounded-full blur-3xl translate-x-1/2 animate-float-subtle opacity-30" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gray-300/20 rounded-full blur-3xl animate-float-subtle opacity-30" style={{ animationDelay: "2s" }}></div>
      </div>

      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-gray-700/40 backdrop-blur-sm bg-gray-950/80 z-10 shadow-glow">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gray-500 flex items-center justify-center text-white shadow-glow hover-glow transition-all">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5v-2l-10 5-10-5v2zM2 12l10 5 10-5v-2l-10 5-10-5v2z" />
              </svg>
            </div>
          <span className="text-xl font-bold text-white">
            SketchFlow
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="container px-4 py-12 mx-auto max-w-3xl">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold tracking-tighter text-white">
                Privacy Policy
              </h1>
              <p className="text-gray-300 md:text-lg">
                Last updated: March 20, 2025
              </p>
            </div>

            <div className="space-y-6 p-6 rounded-xl bg-gray-900/80 backdrop-blur-sm shadow-glow hover-glow transition-all duration-300">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
                <p className="text-gray-300">
                  We collect information you provide directly to us, such as your email address and password, when you create an account or use our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
                <p className="text-gray-300">
                  We use your information to provide, maintain, and improve our services, as well as to communicate with you about updates and promotions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">3. Data Security</h2>
                <p className="text-gray-300">
                  We implement reasonable security measures to protect your data, but no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">4. Cookies</h2>
                <p className="text-gray-300">
                  We use cookies to enhance your experience on our site. You can disable cookies in your browser settings, but this may affect functionality.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">5. Your Rights</h2>
                <p className="text-gray-300">
                  You have the right to access, update, or delete your personal information. Contact us at support@sketchflow.com to exercise these rights.
                </p>
              </section>
            </div>

            <div className="text-center">
              <Link href="/" className="btn-primary inline-block">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
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
          <Link href="/terms" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
            Terms
          </Link>
          <Link href="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
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