"use client";

import React from "react";
import Image from "next/image";
import { BadgeCheck, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroGallery({ images = ["/house1.png"] }: { images?: string[] }) {
  const mainImage = images[0] || "/house1.png";
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section className="w-full">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px] md:h-[600px]"
      >
        <motion.div variants={itemVariants} className="md:col-span-2 rounded-[20px] overflow-hidden relative group cursor-pointer h-full">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            alt="A cinematic, high-angle aerial view of a luxurious modern apartment building in Victoria Island"
            src={mainImage}
            priority
          />
          <div className="absolute top-6 left-6 flex gap-2">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="bg-primary text-white text-[10px] font-label-caps px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md"
            >
              <BadgeCheck size={14} className="text-white" />
              VERIFIED LISTING
            </motion.div>
          </div>
        </motion.div>

        <div className="hidden md:flex flex-col gap-6 h-full">
          <motion.div variants={itemVariants} className="h-1/2 rounded-[20px] overflow-hidden relative">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover hover:opacity-90 cursor-pointer transition-opacity"
              alt="Close-up interior of a modern living room in a Victoria Island penthouse"
              src="/house2.webp"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="h-1/2 rounded-[20px] overflow-hidden relative">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover hover:opacity-90 cursor-pointer transition-opacity"
              alt="Interior shot of a designer kitchen with integrated high-end appliances"
              src="/house3.png"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-4 right-4 bg-white/95 backdrop-blur text-primary text-[10px] font-label-caps px-4 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition-colors hover:bg-white"
            >
              <LayoutGrid size={14} />
              VIEW ALL PHOTOS
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
