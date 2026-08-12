"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import ConnectButton from "@/components/Wallet/ConnectButton";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-surface sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20 md:h-24 max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center z-50">
            <Image 
              src="/logo.png" 
              alt="OgaRent Logo" 
              width={140} 
              height={40} 
              priority 
              className="object-contain object-left -ml-3 w-[120px] md:w-[140px]" 
            />
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-8">
            <Link href="#" className="font-body-md text-primary font-medium border-b-2 border-primary py-2 px-1">
              Renters
            </Link>
            <Link href="#" className="font-body-md text-on-surface-variant hover:text-primary transition-colors py-2 px-1">
              Landlords
            </Link>
            <Link href="#" className="font-body-md text-on-surface-variant hover:text-primary transition-colors py-2 px-1">
              How it Works
            </Link>
          </div>
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/demo" className="font-label-caps text-sm font-bold text-primary hover:opacity-80 transition-opacity bg-primary/10 px-3 py-1.5 rounded-md">
            Demo Helper
          </Link>
          <ConnectButton />
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="md:hidden p-2 text-primary z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay & Drawer */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-surface shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-6 pb-6 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 text-lg">
          <Link 
            href="#" 
            className="font-body-lg text-primary font-medium border-b border-outline-variant/20 pb-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Renters
          </Link>
          <Link 
            href="#" 
            className="font-body-lg text-on-surface-variant font-medium border-b border-outline-variant/20 pb-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Landlords
          </Link>
          <Link 
            href="#" 
            className="font-body-lg text-on-surface-variant font-medium border-b border-outline-variant/20 pb-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How it Works
          </Link>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <Link 
            href="/demo" 
            className="text-center font-label-caps text-sm font-bold text-primary py-3 border border-primary rounded-lg hover:bg-primary/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Demo Helper
          </Link>
          <ConnectButton isMobile={true} />
        </div>
      </div>
    </header>
  );
}
