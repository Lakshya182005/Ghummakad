import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div className="flex justify-between items-center bg-[#FAF3E0] px-6 py-4 shadow-md">
      <div className="flex items-center gap-8">
        <div>
          <Link href="/">
            <Image
              width={70}
              height={70}
              alt="Ghummakad"
              src="/GhummakadLogo.png"
              priority
            />
          </Link>
        </div>
        <div>
          <div className="flex gap-6 text-gray-700 font-semibold">
            
            <Link href="/trips">
              <h1 className="hover:text-[#3BA99C] transition-colors">
                My Trips
              </h1>
            </Link>
            <Link href="/about">
              <h1 className="hover:text-[#3BA99C] transition-colors">
                About Us
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex gap-4 text-gray-700 font-semibold">
        <Link href="/login">
          <h1 className="hover:text-[#FF6B6B] transition-colors">Login</h1>
        </Link>
        <Link href="/signup">
          <h1 className="hover:text-[#FF6B6B] transition-colors">Sign Up</h1>
        </Link>
      </div>
    </div>
  );
}

export default Header;
