"use client"
import Link from "next/link";
import { useState } from "react";
import { Shapes } from "lucide-react";


// Custom CSS (same as above, with added input styles for the form)
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
  .input-field {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }
  .input-field:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }
  .input-field::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    // Add your form submission logic here (e.g., API call)
  };

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
                Contact Us
              </h1>
              <p className="text-gray-300 md:text-lg">
                We’d love to hear from you! Fill out the form below to get in touch.
              </p>
            </div>

            <div className="p-8 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-glow hover-glow transition-all duration-300">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full input-field"
                    required
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full input-field"
                    required
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full input-field min-h-[150px]"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full btn-primary">
                  Send Message
                </button>
              </form>
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
          <Link href="/contract" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}