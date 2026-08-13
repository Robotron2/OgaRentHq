"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function BenefitsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-24 bg-white relative z-10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display-lg text-3xl md:text-4xl text-primary mb-4">Both Sides Win</h2>
          <p className="font-body-lg text-on-surface-variant text-lg">
            OgaRent isn't just about protecting the tenant. It's about giving both parties the confidence to close the deal.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Tenant Benefits */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 bg-surface rounded-3xl p-8 md:p-10 border border-primary-fixed-dim/50 shadow-sm"
          >
            <h3 className="font-headline-md text-2xl text-primary mb-8 pb-4 border-b border-primary/10">Tenant gets confidence</h3>
            <div className="space-y-6">
              {[
                "No more fear of fake agents running away with your rent.",
                "Clear rental terms recorded before you pay.",
                "Transparent escrow status visible anytime.",
                "Defined, predictable completion process."
              ].map((benefit, i) => (
                <motion.div key={i} variants={itemVariants} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <p className="text-on-surface-variant font-body-md leading-relaxed">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Landlord Benefits */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 bg-surface-container rounded-3xl p-8 md:p-10 border border-tertiary-fixed-dim/50 shadow-sm"
          >
            <h3 className="font-headline-md text-2xl text-tertiary mb-8 pb-4 border-b border-tertiary/10">Landlord gets certainty</h3>
            <div className="space-y-6">
              {[
                "Knowing the tenant actually has the funds committed.",
                "Clear agreement on what constitutes a fulfilled lease.",
                "No more 'I will pay tomorrow' excuses.",
                "Verifiable transaction history on-chain."
              ].map((benefit, i) => (
                <motion.div key={i} variants={itemVariants} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <p className="text-on-surface-variant font-body-md leading-relaxed">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
