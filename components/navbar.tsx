"use client";

import React, { useState } from "react";
import Image from "next/image";
import Logo from "@/assets/logo1.png";
import { AlignJustify, X } from "lucide-react";
import Link from "next/link";
import Button from "./common/Button";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blogs", href: "/blogs" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full shadow-xs bg-background/30 backdrop-blur-sm z-50">
      <nav className="w-full mx-auto max-w-5xl flex items-center justify-between text-textColor font-secondary z-50">
        {/* Logo */}
        <div className="flex items-center ">
          <div className="w-24 h-[90px] relative">
            <Link href={"/"}>
              <Image
                src={Logo}
                alt={`muzup Logo`}
                fill
                sizes=""
                className="rounded-lg object-contain w-full h-full"
              />
            </Link>
          </div>
        </div>

        {/* Desktop Nav + Buttons */}
        <div className="hidden md:flex font-semibold items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-subTextColor hover:text-textColor text-sm transition"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button text="Sign In" primary py="py-1.5" />
          <Button text="Log In" />
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden px-6">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <AlignJustify size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed bg-opacity-40 backdrop-filter backdrop-blur-lg top-0 w-full bg-background flex flex-col items-start p-6 space-y-4 shadow-lg md:hidden left-0 right-0">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm hover:text-green-500 transition"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-sm border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
              onClick={() => setMenuOpen(false)}
            >
              Log In
            </Link>
            <Link
              href="/get-started"
              className="text-sm bg-green-500 px-4 py-2 text-white rounded hover:bg-green-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
