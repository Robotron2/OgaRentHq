"use client";

import { motion } from "framer-motion";
import { User, Home, ArrowDown, Lock, Banknote } from "lucide-react";

export default function EscrowJourney() {
  // Mobile stacks vertically, desktop splits it horizontally
  return (
    <section className="py-24 bg-surface-container-low border-b border-outline-variant/30">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display-lg text-3xl md:text-4xl text-primary mb-4">How the Escrow Works</h2>
          <p className="font-body-lg text-on-surface-variant text-lg">
            A simple, transparent process that keeps everyone honest and accountable.
          </p>
        </div>

        {/* Desktop timeline visualization */}
        <div className="hidden lg:flex justify-between items-center relative max-w-5xl mx-auto pt-8">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-[10%] w-[80%] h-1 bg-outline-variant/30 -translate-y-[20px] rounded-full" />
          
          {/* Animated moving dot for funds */}
          <motion.div 
            className="absolute top-1/2 left-[10%] w-3 h-3 bg-primary rounded-full -translate-y-[20px] shadow-[0_0_10px_rgba(0,36,23,0.5)] z-10"
            animate={{ left: ["10%", "50%", "90%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
          />

          <StepCard 
            icon={<User size={24} />} 
            title="1. Tenant Deposits"
            desc="You fund the escrow instead of sending money directly to a personal account."
            delay={0.1}
          />
          
          <StepCard 
            icon={<Lock size={24} />} 
            title="2. Funds Secured"
            desc="OgaRent holds the money securely on-chain while the agreement progresses."
            delay={0.3}
            primary
          />
          
          <StepCard 
            icon={<Home size={24} />} 
            title="3. Lease Completed"
            desc="Tenant gets the keys and confirms they are satisfied."
            delay={0.5}
          />

          <StepCard 
            icon={<Banknote size={24} />} 
            title="4. Landlord Paid"
            desc="The smart contract automatically releases funds to the landlord."
            delay={0.7}
          />
        </div>

        {/* Mobile vertical sequence */}
        <div className="flex flex-col gap-6 lg:hidden max-w-md mx-auto pt-8">
          <MobileStep 
            number={1}
            icon={<User size={20} />}
            title="Tenant Deposits"
            desc="You fund the escrow instead of sending money directly to a personal account."
          />
          <MobileArrow />
          <MobileStep 
            number={2}
            icon={<Lock size={20} />}
            title="Funds Secured"
            desc="OgaRent holds the money securely on-chain while the agreement progresses."
            primary
          />
          <MobileArrow />
          <MobileStep 
            number={3}
            icon={<Home size={20} />}
            title="Lease Completed"
            desc="Tenant gets the keys and confirms they are satisfied."
          />
          <MobileArrow />
          <MobileStep 
            number={4}
            icon={<Banknote size={20} />}
            title="Landlord Paid"
            desc="The smart contract automatically releases funds to the landlord."
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({ icon, title, desc, delay, primary = false }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`relative z-10 flex flex-col items-center w-[220px] text-center p-6 rounded-2xl bg-white border shadow-sm transition-transform hover:-translate-y-2 ${
        primary ? "border-primary shadow-primary/10" : "border-outline-variant/30"
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
        primary ? "bg-primary text-white" : "bg-primary/10 text-primary"
      }`}>
        {icon}
      </div>
      <h3 className="font-headline-sm text-primary mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function MobileStep({ number, icon, title, desc, primary = false }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`flex items-start gap-4 p-5 rounded-2xl bg-white border shadow-sm ${
        primary ? "border-primary" : "border-outline-variant/30"
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
        primary ? "bg-primary text-white" : "bg-primary/10 text-primary"
      }`}>
        {icon}
      </div>
      <div>
        <h3 className="font-headline-sm text-primary mb-1">
          <span className="text-primary/50 text-[10px] mr-2 font-label-caps uppercase tracking-wider">STEP {number}</span>
          <br/>
          {title}
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

function MobileArrow() {
  return (
    <div className="flex justify-center text-outline-variant/50">
      <ArrowDown size={24} />
    </div>
  )
}
