"use client";

import React from "react";
import { BedDouble, Car, Waves, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Property } from "@/data/properties";

export default function PropertyOverview({ property }: { property: Property }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      className="mt-stack-lg pt-stack-lg border-t border-outline-variant/10"
    >
      <motion.h3 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-headline-md text-primary mb-6"
      >
        Property Overview
      </motion.h3>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl border border-outline-variant/20 hover:shadow-md transition-shadow">
          <h5 className="text-[10px] font-label-caps text-outline mb-2">FEATURES</h5>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-on-surface">
              <BedDouble size={20} className="text-primary-container" />
              {property.bedrooms} Luxury Bedrooms
            </li>
            <li className="flex items-center gap-3 text-sm text-on-surface">
              <Car size={20} className="text-primary-container" />
              3 Dedicated Parking Spaces
            </li>
            <li className="flex items-center gap-3 text-sm text-on-surface">
              <Waves size={20} className="text-primary-container" />
              Rooftop Infinity Pool
            </li>
            <li className="flex items-center gap-3 text-sm text-on-surface">
              <Zap size={20} className="text-primary-container" />
              24/7 Power &amp; Security
            </li>
          </ul>
        </motion.div>
        
        <motion.div variants={itemVariants} className="md:col-span-2 bg-white p-6 rounded-xl border border-outline-variant/20 hover:shadow-md transition-shadow">
          <h5 className="text-[10px] font-label-caps text-outline mb-2">
            ABOUT THE PROPERTY
          </h5>
          <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            {property.description}
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
