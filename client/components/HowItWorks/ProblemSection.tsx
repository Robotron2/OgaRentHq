"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Ghost, FileQuestion, HelpCircle, ShieldAlert } from "lucide-react";

export default function ProblemSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="py-24 bg-white relative z-10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display-lg text-3xl md:text-4xl text-primary mb-4">Renting shouldn't feel like a gamble.</h2>
          <p className="font-body-lg text-on-surface-variant text-lg">
            Whether you are looking for a place to stay or leasing out your property, the current system forces both sides to take huge leaps of faith.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tenant Fears */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 bg-surface-container-low rounded-3xl p-8 md:p-10 border border-outline-variant/30 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-error-container rounded-bl-full opacity-20 -z-0 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-outline-variant/30">
                <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="font-headline-md text-xl text-primary">The Tenant's Dilemma</h3>
                  <p className="text-sm text-on-surface-variant">Fear of losing money</p>
                </div>
              </div>

              <div className="space-y-6">
                <motion.div variants={itemVariants} className="flex gap-4">
                  <Ghost className="text-error shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-headline-sm text-primary mb-1">Fake Listings & Scams</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Transferring a year's rent only to discover the agent doesn't actually own or manage the property.</p>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="flex gap-4">
                  <FileQuestion className="text-error shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-headline-sm text-primary mb-1">Changing Agreements</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Hidden fees or suddenly changed tenancy terms after the money has already left your account.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Landlord Fears */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 bg-surface-container-low rounded-3xl p-8 md:p-10 border border-outline-variant/30 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-tertiary-fixed rounded-br-full opacity-20 -z-0 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-outline-variant/30">
                <div className="w-12 h-12 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-headline-md text-xl text-primary">The Landlord's Dilemma</h3>
                  <p className="text-sm text-on-surface-variant">Fear of uncommitted renters</p>
                </div>
              </div>

              <div className="space-y-6">
                <motion.div variants={itemVariants} className="flex gap-4">
                  <HelpCircle className="text-on-tertiary-fixed-variant shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-headline-sm text-primary mb-1">Uncertain Commitment</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Tenants promising to pay "tomorrow" while you turn away other serious prospects.</p>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="flex gap-4">
                  <Clock className="text-on-tertiary-fixed-variant shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-headline-sm text-primary mb-1">Payment Delays</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Long, drawn-out negotiation processes that end up with incomplete or delayed rent deposits.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
