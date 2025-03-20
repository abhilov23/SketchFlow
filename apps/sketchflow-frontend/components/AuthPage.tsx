"use client";

import { useState } from "react";

export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h2>

        {/* Form */}
        <form className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              console.log({ email, password, isSignIn });
            }}
            className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          {isSignIn ? "Need an account?" : "Already have an account?"}{" "}
          <a
            href={isSignIn ? "/signup" : "/signin"}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </a>
        </p>
      </div>
    </div>
  );
}