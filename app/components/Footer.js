import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="flex justify-between items-center bg-[#FAF3E0] px-6 py-4">
      <div>
        <Image
          width={200}
          height={200}
          alt="GhummakadLogo"
          src="/GhummakadLogo.png"
        />
      </div>
      <div className="text-gray-700 font-semibold">
        <Link href="/dashboard">
          <h1 className="hover:text-[#3BA99C] transition-colors">Dashboard</h1>
        </Link>
        <Link href="/trips">
          <h1 className="hover:text-[#3BA99C] transition-colors">My Trips</h1>
        </Link>
        <Link href="/about">
          <h1 className="hover:text-[#3BA99C] transition-colors">About Us</h1>
        </Link>
        <Link href="/blog">
          <h1 className="hover:text-[#3BA99C] transition-colors">Blogs</h1>
        </Link>
      </div>
      <div>
        <div>
          <h1>Contact Me</h1>
          <div className="flex gap-4 text-2xl">
            <Link
              href="https://www.linkedin.com/in/lakshya-agrawal18/"
              target="_blank"
              className="hover:text-[#3BA99C]"
            >
              <FaLinkedin />
            </Link>
            <Link
              href="https://github.com/Lakshya182005"
              target="_blank"
              className="hover:text-[#3BA99C]"
            >
              <FaGithub />
            </Link>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>© 2025 Ghummakad. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
