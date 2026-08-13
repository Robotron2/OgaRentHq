"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import ConnectButton from "@/components/Wallet/ConnectButton";
import { useWallet } from "@/hooks/useWallet";

export default function Navbar() {
  const { isConnected } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Only apply transparent-to-solid transition on the home page
  const isHomePage = pathname === "/";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track scroll position to transition navbar bg on home page
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to handle already-scrolled state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

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

  // Determine if the navbar is currently "transparent" (on hero)
  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;

  // Derived class values
  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-surface/95 backdrop-blur-md border-b border-outline-variant/20 shadow-sm";

  const linkColor = (activePath: string) => {
    const isActive = pathname === activePath;
    if (isTransparent) {
      return isActive
        ? "text-white font-medium border-b-2 border-white/60"
        : "text-white/75 hover:text-white border-b-2 border-transparent";
    }
    return isActive
      ? "text-primary font-medium border-b-2 border-primary"
      : "text-on-surface-variant hover:text-primary border-b-2 border-transparent";
  };

  const hamburgerColor = isTransparent ? "text-white" : "text-primary";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerBg}`}>
      <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20 md:h-24 max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center z-50">
            <Image
              src="/logo.png"
              alt="OgaRent Logo"
              width={140}
              height={40}
              priority
              className={`object-contain object-left -ml-3 w-[120px] md:w-[140px] transition-all duration-300 ${
                isTransparent ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex gap-8 items-center">
            <Link
              href="/how-it-works"
              className={`font-body-md transition-colors py-2 px-1 ${linkColor("/how-it-works")}`}
            >
              How it Works
            </Link>
            {isMounted && isConnected && (
              <Link
                href="/dashboard"
                className={`font-body-md transition-colors py-2 px-1 ${linkColor("/dashboard")}`}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <ConnectButton />
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className={`lg:hidden p-2 z-50 transition-colors ${hamburgerColor}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay & Drawer */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-surface shadow-2xl z-40 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col pt-24 px-6 pb-6 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 text-lg">
          <Link
            href="/how-it-works"
            className={`font-body-lg font-medium border-b pb-4 ${
              pathname === "/how-it-works"
                ? "text-primary border-primary/30"
                : "text-on-surface-variant border-outline-variant/20"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How it Works
          </Link>
          {isMounted && isConnected && (
            <Link
              href="/dashboard"
              className={`font-body-lg font-medium border-b pb-4 ${
                pathname === "/dashboard"
                  ? "text-primary border-primary/30"
                  : "text-on-surface-variant border-outline-variant/20"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <ConnectButton isMobile={true} />
        </div>
      </div>
    </header>
  );
}
