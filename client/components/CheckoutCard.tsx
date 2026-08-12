"use client";

import React from "react";
import { ShieldCheck, ArrowRight, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutCard() {
  return (
    <div className="sticky top-24 space-y-stack-md">
      {/* Escrow Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl p-stack-lg border border-outline-variant/30 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-stack-md">
          <div className="p-2 bg-tertiary-fixed/30 rounded-lg">
            <ShieldCheck size={24} className="text-on-tertiary-fixed-variant" />
          </div>
          <div>
            <h3 className="font-headline-md text-body-md text-primary">
              Escrow Summary
            </h3>
            <p className="text-xs text-on-surface-variant">
              Transaction ID: OR-VI-29402
            </p>
          </div>
        </div>

        <div className="space-y-3 py-stack-md border-y border-outline-variant/10">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Annual Rent</span>
            <span className="font-data-tabular font-medium">₦12,500,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Caution Deposit (Refundable)</span>
            <span className="font-data-tabular font-medium">₦1,250,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Legal &amp; Agency Fees (5%)</span>
            <span className="font-data-tabular font-medium">₦1,250,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">OgaRent Processing Fee</span>
            <span className="font-data-tabular font-medium">₦50,000</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-stack-md mb-stack-lg">
          <span className="font-headline-md text-body-md text-primary">
            Total Escrow Pay
          </span>
          <span className="font-display-lg text-headline-md text-primary">
            ₦15,050,000
          </span>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary text-white py-4 rounded-xl font-headline-md text-body-md flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 hover:bg-primary-container hover:text-on-primary-container group"
        >
          Start Escrow Now
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
        <p className="text-[11px] text-center text-outline mt-4 px-4 leading-relaxed">
          Your money is safe. We only release it once you&apos;ve confirmed receipt
          of keys and property condition.
        </p>
      </motion.div>

      {/* Verified Badge Cluster */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="p-stack-md bg-white rounded-2xl border border-outline-variant/30 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
          >
            <path
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="none"
              id="textPath"
            ></path>
            <text className="font-label-caps text-[8px] fill-tertiary-fixed-variant">
              <textPath xlinkHref="#textPath">
                OGARENT SECURED • TRUSTED PROPERTY •{" "}
              </textPath>
            </text>
          </motion.svg>
          <ShieldAlert size={24} className="text-tertiary-fixed-dim" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-primary">
            OgaRent Verified Landlord
          </h4>
          <p className="text-xs text-on-surface-variant">
            Profile active for 3+ years. 12 successful escrow completions.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
