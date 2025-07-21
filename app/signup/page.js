"use client";

import React, { useRef, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiLoader } from "react-icons/fi";

function SignUp() {
  const userRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSignUp(e) {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const username = userRef.current.value;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        username,
        createdAt: new Date().toISOString(),
      });

      // Optional: Sync with localStorage (for initial session persistence)
      localStorage.setItem(
        "ghummakadUser",
        JSON.stringify({
          email,
          uid: user.uid,
          username,
        })
      );

      setSuccess("Account created! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(err.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFFDF6]">
      <div className="bg-[#FAF3E0] rounded-3xl shadow-xl w-full max-w-md p-10 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#333333] mb-4">Join Ghummakad</h2>
          <p className="text-gray-500 text-lg">Create an account to start your journey</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-8">
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-lg font-medium text-[#333333] mb-3">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                ref={userRef}
                placeholder="Your name"
                className="w-full p-4 pl-12 border bg-white border-[#E0E0E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3BA99C] text-lg"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FiUser className="h-6 w-6" />
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-lg font-medium text-[#333333] mb-3">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                ref={emailRef}
                placeholder="you@example.com"
                className="w-full p-4 pl-12 border bg-white border-[#E0E0E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3BA99C] text-lg"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FiMail className="h-6 w-6" />
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
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
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FiLock className="h-6 w-6" />
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 rounded-xl shadow-sm text-lg font-medium text-white bg-[#3BA99C] hover:bg-[#329589] transition"
          >
            {isLoading ? (
              <span className="flex items-center">
                <FiLoader className="animate-spin -ml-1 mr-3 h-6 w-6" />
                Creating account...
              </span>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-base text-[#333333]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#3BA99C] hover:text-[#329589]">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
