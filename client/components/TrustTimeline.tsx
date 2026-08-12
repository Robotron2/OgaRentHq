"use client";

import React from "react";
import { Check, Hourglass, Shield, Key, Banknote } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustTimeline() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="p-stack-lg bg-surface-container-low rounded-2xl border border-outline-variant/20"
    >
      <h3 className="font-headline-md text-primary mb-6">Your Journey to Move-in</h3>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-8 relative"
      >
        {/* Step 1: Active */}
        <motion.div variants={stepVariants} className="flex gap-stack-md relative">
          <div className="z-10 bg-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-[0_0_12px_rgba(0,36,23,0.3)]">
            <Check size={14} className="text-white" />
          </div>
          <div className="absolute top-6 bottom-[-32px] left-3 w-px border-l-2 border-dashed border-primary"></div>
          <div>
            <h4 className="font-medium text-primary">Intent to Rent</h4>
            <p className="text-on-surface-variant text-sm mt-1">
              Submit your interest and complete basic renter profiling.
            </p>
            <span className="inline-block mt-2 text-[10px] font-label-caps text-primary px-2 py-0.5 bg-primary/10 rounded">
              COMPLETED
            </span>
          </div>
        </motion.div>

        {/* Step 2: Current */}
        <motion.div variants={stepVariants} className="flex gap-stack-md relative">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="z-10 bg-tertiary-fixed-dim w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ring-4 ring-tertiary-fixed/20 shadow-[0_0_15px_rgba(240,191,94,0.4)]"
          >
            <Hourglass size={14} className="text-on-tertiary-fixed" />
          </motion.div>
          <div className="absolute top-6 bottom-[-32px] left-3 w-px border-l-2 border-dashed border-outline-variant/40"></div>
          <div>
            <h4 className="font-medium text-primary">Secure Escrow Deposit</h4>
            <p className="text-on-surface-variant text-sm mt-1">
              Funds are moved to OgaRent&apos;s secure custody. No one gets paid yet.
            </p>
            <div className="mt-4 p-stack-sm bg-white border border-outline-variant/20 rounded-lg max-w-sm">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
                <Shield size={14} />
                SECURED BY OGARENT
              </div>
              <div className="text-xl font-display-lg text-primary">₦15,000,000</div>
              <p className="text-[10px] text-outline mt-1 uppercase tracking-wider">
                Estimated Escrow Holding
              </p>
            </div>
          </div>
        </motion.div>

        {/* Step 3: Pending */}
        <motion.div variants={stepVariants} className="flex gap-stack-md relative opacity-50">
          <div className="z-10 bg-white border-2 border-outline w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1">
            <Key size={14} className="text-outline" />
          </div>
          <div className="absolute top-6 bottom-[-32px] left-3 w-px border-l-2 border-dashed border-outline-variant/40"></div>
          <div>
            <h4 className="font-medium text-primary">Keys &amp; Handover</h4>
            <p className="text-on-surface-variant text-sm mt-1">
              Receive physical keys and sign the digital acceptance certificate.
            </p>
          </div>
        </motion.div>

        {/* Step 4: Final */}
        <motion.div variants={stepVariants} className="flex gap-stack-md relative opacity-50">
          <div className="z-10 bg-white border-2 border-outline w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1">
            <Banknote size={14} className="text-outline" />
          </div>
          <div>
            <h4 className="font-medium text-primary">Fund Release</h4>
            <p className="text-on-surface-variant text-sm mt-1">
              Landlord is paid. OgaRent finalizes the transaction.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
