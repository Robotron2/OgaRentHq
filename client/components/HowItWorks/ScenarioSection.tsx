"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function ScenarioSection() {
  return (
    <section className="py-24 bg-surface-container-highest overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center gap-16">
        
        <div className="flex-1 max-w-xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display-lg text-3xl md:text-4xl text-primary mb-12 leading-tight"
          >
            A real rental experience, exactly how it should be.
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative pl-6 md:pl-8 space-y-8"
          >
            {/* Vertical timeline line */}
            <div className="absolute top-2 bottom-2 left-[11px] md:left-[15px] w-0.5 bg-outline-variant/30" />
            
            {/* Story timeline steps */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] top-1 flex items-center justify-center w-6 h-6 rounded-full border-[4px] border-surface-container-highest bg-primary text-white shadow-sm z-10" />
              <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-sm transition-transform hover:-translate-y-1">
                <p className="font-headline-sm text-primary mb-1">1. Discovery</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">Chidi finds a beautiful 3-bedroom duplex in Lekki listed on OgaRent.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] top-1 flex items-center justify-center w-6 h-6 rounded-full border-[4px] border-surface-container-highest bg-primary text-white shadow-sm z-10" />
              <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-sm transition-transform hover:-translate-y-1">
                <p className="font-headline-sm text-primary mb-1">2. Agreement</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">He initiates an escrow. The rental terms are securely recorded on-chain, fully transparent to him and the landlord.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] top-1 flex items-center justify-center w-6 h-6 rounded-full border-[4px] border-surface-container-highest bg-primary text-white shadow-sm z-10" />
              <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-sm transition-transform hover:-translate-y-1">
                <p className="font-headline-sm text-primary mb-1">3. Move In</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">Chidi inspects the house, receives the keys, and marks the rental agreement as successfully fulfilled in the app.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] top-1 flex items-center justify-center w-6 h-6 rounded-full border-[4px] border-surface-container-highest bg-primary text-white shadow-sm z-10" />
              <div className="p-5 rounded-2xl bg-primary border border-primary text-white shadow-md transition-transform hover:-translate-y-1">
                <p className="font-headline-sm text-white mb-1 flex items-center gap-2"><CheckCircle2 size={16}/> 4. Payment Released</p>
                <p className="text-sm text-white/80 leading-relaxed">The escrow instantly releases the funds to the landlord. Everyone walks away happy with no stories.</p>
              </div>
            </div>
            
          </motion.div>
        </div>
        
        <div className="flex-1 w-full relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-xl"
          >
            <Image 
              src="/house3.png" 
              alt="Beautiful verified property" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30">
                  <span className="font-headline-md">C</span>
                </div>
                <div>
                  <p className="font-headline-sm leading-tight">Chidi A.</p>
                  <p className="text-xs text-white/70">Verified Renter</p>
                </div>
              </div>
              <p className="text-white/90 italic font-body-md leading-relaxed">"First time renting in Lagos without the anxiety. The escrow process made everything incredibly straightforward."</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
