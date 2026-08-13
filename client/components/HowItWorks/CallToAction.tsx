"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-24 bg-white relative z-10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Background graphics */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary-fixed/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display-lg text-3xl md:text-5xl text-white mb-6 leading-tight">
              Ready to rent with confidence?
            </h2>
            <p className="font-body-lg text-white/80 text-lg mb-10 leading-relaxed">
              Finding a home is already stressful enough. OgaRent makes the transaction transparent and easy to trust.
            </p>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-3 bg-white text-primary font-label-caps font-bold text-sm px-8 py-4 rounded-full hover:bg-surface-container transition-transform hover:-translate-y-1 shadow-lg"
            >
              <Search size={18} strokeWidth={2.5} />
              Find Your Next Home
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
