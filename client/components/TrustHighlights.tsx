"use client";

import React from "react";
import { ShieldCheck, ClipboardCheck, Scale } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustHighlights() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-stack-md"
    >
      <motion.div variants={cardVariants} className="p-stack-md bg-white border border-outline-variant/30 rounded-xl hover:shadow-md transition-shadow">
        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-3">
          <ShieldCheck size={20} />
        </div>
        <h4 className="font-headline-md text-body-md text-primary mb-1">
          Escrow Protected
        </h4>
        <p className="text-sm text-on-surface-variant">
          Your funds are held safely until you receive your keys and sign the handover.
        </p>
      </motion.div>
      
      <motion.div variants={cardVariants} className="p-stack-md bg-white border border-outline-variant/30 rounded-xl hover:shadow-md transition-shadow">
        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-3">
          <ClipboardCheck size={20} />
        </div>
        <h4 className="font-headline-md text-body-md text-primary mb-1">
          Physical Verification
        </h4>
        <p className="text-sm text-on-surface-variant">
          Our agents have personally visited this property to confirm its status.
        </p>
      </motion.div>
      
      <motion.div variants={cardVariants} className="p-stack-md bg-white border border-outline-variant/30 rounded-xl hover:shadow-md transition-shadow">
        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-3">
          <Scale size={20} />
        </div>
        <h4 className="font-headline-md text-body-md text-primary mb-1">
          Legal Oversight
        </h4>
        <p className="text-sm text-on-surface-variant">
          Standardized contracts vetted by Nigerian tenancy legal experts.
        </p>
      </motion.div>
    </motion.div>
  );
}
