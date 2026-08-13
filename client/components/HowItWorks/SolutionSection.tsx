"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

export default function SolutionSection() {
  return (
    <section className="relative bg-primary py-24 md:py-32 overflow-hidden text-on-primary">
      {/* Background graphical elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] border-[40px] border-white rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] border-[60px] border-white rounded-full translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-16 h-16 mx-auto bg-white/5 text-white/60 rounded-full flex items-center justify-center mb-8 border border-white/10 backdrop-blur">
            <ArrowDown size={32} strokeWidth={1.5} className="animate-bounce" />
          </div>
          
          <h2 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
            OgaRent keeps the agreement and the money perfectly aligned.
          </h2>
          <p className="font-body-lg text-lg text-on-primary/80 max-w-2xl mx-auto leading-relaxed">
            We act as the neutral trust layer. When you pay for rent, the money isn't handed directly to a stranger. It is locked securely in a transparent on-chain escrow until the agreement is fully met.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 w-full max-w-xl mx-auto bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative"
        >
          {/* Conceptual OgaRent Logo glowing in center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.2)] border-4 border-primary">
                <Image src="/logo.png" alt="OgaRent Shield" width={64} height={20} className="object-contain" />
             </div>
          </div>
          
          <div className="pt-12 grid grid-cols-2 gap-8 text-center divide-x divide-white/10">
            <div>
              <h4 className="font-headline-sm text-primary-fixed mb-2">For Tenants</h4>
              <p className="text-sm text-white/80 leading-relaxed">You know exactly where your money is and when it leaves.</p>
            </div>
            <div>
              <h4 className="font-headline-sm text-tertiary-fixed mb-2">For Landlords</h4>
              <p className="text-sm text-white/80 leading-relaxed">You know the tenant has the funds ready and secured.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
