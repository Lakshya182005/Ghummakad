"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FiMenu, FiX } from "react-icons/fi";

function Header() {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const getUsername = async () => {
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data?.username || user.email);
        }
      }
    };
    getUsername();
  }, [user]);

  return (
    <header className="bg-[#FAF3E0] shadow-md px-6 py-4 relative z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            width={50}
            height={50}
            alt="Ghummakad"
            src="/GhummakadLogo.png"
            priority
          />
          <span className="text-xl font-bold text-[#996130] hidden sm:inline">Ghummakad</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-semibold">
          <Link href="/trips" className="hover:text-[#3BA99C]">My Trips</Link>
          <Link href="/budget" className="hover:text-[#3BA99C]">Budget Calculator</Link>
          <Link href="/currency" className="hover:text-[#3BA99C]">Currency Converter</Link>
          <Link href="/about" className="hover:text-[#3BA99C]">About Us</Link>
        </nav>

        {/* Right-side user */}
        <div className="hidden md:flex items-center gap-4 text-gray-700 font-semibold">
          {!user ? (
            <>
              <Link href="/login" className="hover:text-[#FF6B6B]">Login</Link>
              <Link href="/signup" className="hover:text-[#FF6B6B]">Sign Up</Link>
            </>
          ) : (
            <>
              <span className="text-[#3BA99C]">Welcome, {username}</span>
              <button
                onClick={logout}
                className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4 border-t pt-4 text-gray-700 font-medium">
          <Link href="/trips" className="block hover:text-[#3BA99C]" onClick={() => setIsMenuOpen(false)}>My Trips</Link>
          <Link href="/budget" className="block hover:text-[#3BA99C]" onClick={() => setIsMenuOpen(false)}>Budget Calculator</Link>
          <Link href="/currency" className="block hover:text-[#3BA99C]" onClick={() => setIsMenuOpen(false)}>Currency Converter</Link>
          <Link href="/about" className="block hover:text-[#3BA99C]" onClick={() => setIsMenuOpen(false)}>About Us</Link>

          {!user ? (
            <>
              <Link href="/login" className="block hover:text-[#FF6B6B]" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link href="/signup" className="block hover:text-[#FF6B6B]" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          ) : (
            <>
              <p className="text-[#3BA99C]">Welcome, {username}</p>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-red-500 transition mt-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
