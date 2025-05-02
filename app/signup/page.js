"use client";
import React, { useRef } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "../firebase/firebase";
import Link from "next/link";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Import getFirestore

function SignUp() {
  let emailRef = useRef("");
  let passwordRef = useRef("");
  const auth = getAuth(app);
  const db = getFirestore(app); // Initialize Firestore

  async function handleSignUp(e) {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      const user = userCredential.user;
      console.log("Signup done for user:", user.uid);

      // Now you can add user data to Firestore
      try {
        const docRef = await addDoc(collection(db, "users"), {
          uid: user.uid, // Store the user's UID
          email: emailRef.current.value
          // Add any other relevant user data here
        });
        console.log("User data added to Firestore with ID: ", docRef.id);
        // Optionally redirect the user or update UI
      } catch (error) {
        console.error("Error adding user data to Firestore: ", error);
        // Handle the error appropriately
      }
    } catch (err) {
      console.error("Signup error:", err);
      // Handle signup errors (e.g., display error message to the user)
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
        <Link href="/login">
          <p>Already have an Account?</p>
        </Link>
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
