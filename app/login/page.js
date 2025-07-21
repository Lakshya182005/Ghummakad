"use client";
import React, { useRef, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiLoader } from "react-icons/fi";

function Login() {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFFDF6]">
      <div className="bg-[#FAF3E0] rounded-3xl shadow-xl w-full max-w-md p-10 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#333333] mb-4">Welcome Back</h2>
          <p className="text-gray-500 text-lg">Sign in to continue your adventure</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-200 text-green-700 p-4 mb-6 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-lg font-medium text-[#333333] mb-3">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                ref={emailRef}
                placeholder="your@email.com"
                className="w-full p-4 pl-12 border bg-white border-[#E0E0E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3BA99C] text-lg"
                required
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiMail className="h-6 w-6" />
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label htmlFor="password" className="block text-lg font-medium text-[#333333] mb-3">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                ref={passwordRef}
                placeholder="••••••••"
                className="w-full p-4 pl-12 border bg-white border-[#E0E0E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3BA99C] text-lg"
                required
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiLock className="h-6 w-6" />
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 rounded-xl shadow-sm text-lg font-medium text-white bg-[#3BA99C] hover:bg-[#329589] focus:outline-none transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <FiLoader className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-base text-[#333333]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-[#3BA99C] hover:text-[#329589]">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
