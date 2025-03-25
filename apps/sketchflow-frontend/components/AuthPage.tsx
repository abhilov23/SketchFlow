"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Custom CSS (unchanged)
const customStyles = `
  .shadow-glow { box-shadow: 0 0 15px rgba(255, 255, 255, 0.1); }
  .hover-glow:hover { box-shadow: 0 0 20px rgba(255, 255, 255, 0.2); }
  .animate-float-subtle { animation: floatSubtle 6s ease-in-out infinite; }
  @keyframes floatSubtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
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
  .btn-primary:focus { outline: none; box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3); }
  .btn-primary:active { transform: scale(0.95); }
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
  .input-field::placeholder { color: rgba(255, 255, 255, 0.4); }
`;

export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for name
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const endpoint = isSignIn ? "/signin" : "/signup"; // Added /api prefix to match backend
    const url = `http://localhost:3005${endpoint}`; // Your backend URL

    try {
      const body = isSignIn
        ? { username, password }
        : { username, password, name }; 

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isSignIn) {
        localStorage.setItem("token", data.token);
        setMessage("Signed in successfully!");
        router.push("/dashboard");
      } else {
        setMessage("Account created successfully! Please sign in.");
        setUsername("");
        setPassword("");
        setName("");
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-950 text-white">
      <style>{customStyles}</style>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float-subtle opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gray-400/20 rounded-full blur-3xl translate-x-1/2 animate-float-subtle opacity-30" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gray-300/20 rounded-full blur-3xl animate-float-subtle opacity-30" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="p-8 bg-gray-900/80 backdrop-blur-sm rounded-xl w-full max-w-md transform transition-all shadow-glow hover-glow">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="username"
              type="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full input-field"
              required
            />
          </div>

          {!isSignIn && ( // Show name field only for signup
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
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-primary ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          {isSignIn ? "Need an account?" : "Already have an account?"}{" "}
          <Link
            href={isSignIn ? "/signup" : "/signin"}
            className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}