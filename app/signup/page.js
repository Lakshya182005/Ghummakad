"use client";
import React, { useRef } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "../firebase/firebase";
import Link from "next/link";

function SignUp() {
  let emailRef = useRef("");
  let passwordRef = useRef("");

  const auth = getAuth(app);

  async function handleSignUp(e) {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      console.log("signup done", emailRef.current, passwordRef.current);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand px-4">
      <form
        onSubmit={handleSignUp}
        className="bg-cloud p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-charcoal text-center">
          Create an Account
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
        <Link href="/login"><p>Already have an Account?</p></Link>
        <input
          type="submit"
          value="Sign Up"
          className="w-full bg-dusk text-cloud font-semibold py-3 rounded-xl hover:bg-teal transition"
        />
      </form>
    </div>
  );
}

export default SignUp;
