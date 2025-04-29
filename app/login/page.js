"use client";
import React, { useRef } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "../firebase/firebase";
import Link from "next/link";

function Login() {
  let emailRef = useRef("");
  let passwordRef = useRef("");

  const auth = getAuth(app);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      console.log("login done", emailRef.current, passwordRef.current);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand px-4">
      <form
        onSubmit={handleLogin}
        className="bg-cloud p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-charcoal text-center">
          Login to Ghummakad
        </h2>
        <input
          type="text"
          ref={emailRef}
          placeholder="Enter your Email"
          className="w-full p-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-teal"
        />
        <input
          type="password"
          ref={passwordRef}
          placeholder="Enter your Password"
          className="w-full p-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-teal"
        />
        <Link href="/signup"><p>Don't have an Account?</p></Link>
        <input
          type="submit"
          value="Login"
          className="w-full bg-dusk text-cloud font-semibold py-3 rounded-xl hover:bg-teal transition"
        />
      </form>
    </div>
  );
}

export default Login;
