"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Key } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-surface-container-low border-b border-outline-variant/30">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-label-caps text-xs font-bold mb-6">
              <Search size={14} />
              The Rental Struggle
            </div>
            <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-primary leading-[1.1] tracking-tight mb-6">
              You finally found the perfect house.
              <br />
              <span className="text-on-surface-variant/80">Now comes the hard part: knowing who to trust.</span>
            </h1>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Searching for a home in Nigeria takes weeks of effort. But the real anxiety begins when it's time to transfer your hard-earned money to a landlord or agent you barely know.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full relative"
        >
          <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image 
              src="/house1.png" 
              alt="Beautiful rental property" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            
            {/* Contextual overlay showing uncertainty */}
            <div className="absolute bottom-6 left-6 right-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="bg-white/95 backdrop-blur p-4 md:p-5 rounded-2xl shadow-lg border border-white/20 flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0 mt-0.5">
                  <Key size={20} />
                </div>
                <div>
                  <p className="font-headline-sm text-primary mb-1">"Please pay before inspection"</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Are you sure this listing is real? What if the landlord changes their mind after you transfer the money?</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-tertiary-fixed rounded-full blur-3xl opacity-50 -z-10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-fixed rounded-full blur-3xl opacity-40 -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
