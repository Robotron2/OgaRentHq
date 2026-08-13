"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, MapPin } from "lucide-react";

// Stagger container for the left-column content
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const cardVariants = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const, delay: 0.6 } },
};

const LOCATIONS = ["Lekki", "Victoria Island", "Ikoyi", "Ikeja GRA", "Surulere", "Ajah"];

export default function Hero() {
  return (
    <section className="relative min-h-[92svh] md:min-h-[88svh] flex flex-col overflow-hidden">
      {/* ─── Background: Property Image Collage ───────────────────────── */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-[3fr_1fr_1fr]">
        {/* Dominant image — most Nigerian-authentic */}
        <div className="relative col-span-2 md:col-span-1 h-full">
          <Image
            src="/house3.png"
            alt="Nigerian residential property"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </div>
        {/* Secondary images — desktop only */}
        <div className="relative hidden md:block h-full">
          <Image
            src="/house1.png"
            alt="Modern luxury villa"
            fill
            priority
            className="object-cover"
            sizes="20vw"
          />
        </div>
        <div className="relative hidden md:block h-full">
          <Image
            src="/house2.webp"
            alt="Residential estate aerial view"
            fill
            className="object-cover"
            sizes="20vw"
          />
        </div>
      </div>

      {/* ─── Dark overlay with brand tint ─────────────────────────────── */}
      <div className="absolute inset-0 bg-primary/70" />
      {/* Subtle gradient to ground the bottom content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* ─── Vertical dividers between collage panels (desktop) ────────── */}
      <div className="absolute inset-y-0 hidden md:block" style={{ left: "50%" }}>
        <div className="h-full w-px bg-white/10" />
      </div>
      <div className="absolute inset-y-0 hidden md:block" style={{ left: "75%" }}>
        <div className="h-full w-px bg-white/10" />
      </div>

      {/* ─── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full py-24 md:py-28">
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 lg:gap-16">

          {/* Left: Brand Message */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1 max-w-xl text-white"
          >
            {/* Eyebrow tag */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 font-label-caps text-xs tracking-widest text-white/70 uppercase bg-white/10 border border-white/15 px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse" />
                OgaRent Marketplace
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-6"
            >
              Find your next home
              <br />
              <span className="text-primary-fixed-dim">with confidence.</span>
            </motion.h1>

            {/* Supporting copy */}
            <motion.p
              variants={itemVariants}
              className="font-body-lg text-lg text-white/75 leading-relaxed mb-10 max-w-lg"
            >
              Browse verified properties across Nigeria. Your rent is held securely in escrow — released only when the agreement is fulfilled.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link
                href="#marketplace"
                className="inline-flex items-center gap-2.5 bg-white text-primary font-label-caps font-bold text-sm px-7 py-4 rounded-full hover:bg-primary-fixed transition-colors shadow-lg shadow-black/20"
              >
                Find a Home
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2.5 bg-white/10 text-white border border-white/20 font-label-caps font-bold text-sm px-7 py-4 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                How It Works
              </Link>
            </motion.div>

            {/* Location pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 mt-10"
            >
              {LOCATIONS.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1.5 text-xs text-white/60 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
                >
                  <MapPin size={10} />
                  {loc}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Escrow Trust Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="w-full lg:w-80 shrink-0"
          >
            <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-7 text-white shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed/20 border border-primary-fixed/30 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-primary-fixed" />
                </div>
                <div>
                  <p className="font-headline-sm font-bold text-white leading-tight">Funds Protected</p>
                  <p className="text-xs text-white/55 mt-0.5">Secured in escrow until move-in</p>
                </div>
              </div>

              {/* Fund flow diagram */}
              <div className="space-y-1">
                <FlowStep
                  number="1"
                  label="You find a property"
                  sub="Browse verified listings"
                />
                <FlowConnector />
                <FlowStep
                  number="2"
                  label="Rent enters escrow"
                  sub="Not sent directly to anyone"
                  highlight
                />
                <FlowConnector />
                <FlowStep
                  number="3"
                  label="Agreement fulfilled"
                  sub="You confirm the move-in"
                />
                <FlowConnector />
                <FlowStep
                  number="4"
                  label="Landlord receives payment"
                  sub="Funds released automatically"
                />
              </div>

              {/* Footer badge */}
              <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/50 font-label-caps tracking-wider uppercase">Powered by</span>
                <span className="text-xs text-primary-fixed font-label-caps font-bold tracking-wider uppercase">On-Chain Escrow</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ─── Bottom strip: Marketplace anchor ─────────────────────────── */}
      <div id="marketplace" className="relative z-10 h-0" aria-hidden="true" />
    </section>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function FlowStep({ number, label, sub, highlight = false }: {
  number: string;
  label: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${highlight ? "bg-primary-fixed/15 border border-primary-fixed/20" : ""}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${highlight ? "bg-primary-fixed text-primary" : "bg-white/10 text-white/70"}`}>
        {number}
      </div>
      <div>
        <p className={`text-sm font-semibold leading-tight ${highlight ? "text-primary-fixed" : "text-white/90"}`}>{label}</p>
        <p className="text-xs text-white/45 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="flex items-center pl-[22px] py-0.5">
      <div className="w-px h-3 bg-white/15 ml-2.5" />
    </div>
  );
}
