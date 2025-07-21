"use client";
import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-[#FAF3E0] px-6 py-8 mt-8 border-t">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between gap-10 text-center md:text-left">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            width={140}
            height={100}
            alt="GhummakadLogo"
            src="/GhummakadLogo.png"
          />
        </div>

        {/* Navigation / Links */}
        <div className="space-y-2 text-gray-700 font-medium">
          <h2 className="font-semibold text-lg">Quick Links</h2>
          <Link className="block hover:text-[#3BA99C] transition" href="/trips">My Trips</Link>
          <Link className="block hover:text-[#3BA99C] transition" href="/budget">Budget Calculator</Link>
          <Link className="block hover:text-[#3BA99C] transition" href="/currency">Currency Converter</Link>
          <Link className="block hover:text-[#3BA99C] transition" href="/about">About Us</Link>
        </div>

        {/* Contact Section */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Contact Me</h2>
          <div className="flex justify-center md:justify-start gap-4 text-2xl">
            <Link
              href="https://www.linkedin.com/in/lakshya-agrawal18/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#3BA99C]"
            >
              <FaLinkedin />
            </Link>
            <Link
              href="https://github.com/Lakshya182005"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#3BA99C]"
            >
              <FaGithub />
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            © 2025 Ghummakad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
