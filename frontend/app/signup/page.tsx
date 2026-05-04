"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created successfully!");

        setTimeout(() => {
          router.push("/login");
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

        {/* Header */}
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
          <button
            onClick={() => router.push("/login")}
            className="w-1/2 py-2 text-gray-400"
          >
            Log in
          </button>
          <button className="w-1/2 py-2 bg-black rounded-lg font-semibold">
            Sign up
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">Create account</h2>
        <p className="text-gray-400 mb-6">
          Start solving math smarter, for free.
        </p>

        {/* Inputs */}
        <input
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-lg"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-lg"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg"
        >
          Create account
        </button>

        {/* Message */}
        <p className="mt-4 text-sm text-center">{message}</p>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-6 text-center">
          By signing up, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}