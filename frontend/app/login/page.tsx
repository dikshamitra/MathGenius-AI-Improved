"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        setMessage("Login successful!");

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setMessage(data.detail);
      }
    } catch (error) {
      setMessage("Error connecting to backend");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-[#111] p-8 rounded-2xl shadow-lg border border-gray-800">

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold flex items-center justify-center gap-2">
            <Image
              src="/mathgenius-logo.png"
              alt="MathGenius Logo"
              width={60}
              height={60}
            />
            MathGenius AI
          </h1>
        </div>

        {/* Toggle */}
        <div className="flex bg-[#222] rounded-lg mb-6">
          <button className="w-1/2 py-2 bg-black rounded-lg font-semibold">
            Log in
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="w-1/2 py-2 text-gray-400"
          >
            Sign up
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
        <p className="text-gray-400 mb-6">
          Log in to continue solving math problems.
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-lg"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-2 bg-black border border-gray-700 rounded-lg"
        />

        {/* Forgot */}
        <div className="text-right text-sm text-gray-400 mb-4 cursor-pointer">
          Forgot password?
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg"
        >
          Log in
        </button>

        {/* Message */}
        <p className="mt-4 text-sm text-center">{message}</p>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-6 text-center">
          By logging in, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}