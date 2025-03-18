"use client";

export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <div className="p-6 bg-white rounded-lg shadow-lg w-80">
        <h2 className="text-2xl text-black  text-center mb-4">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => {}}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </div>
  );
}