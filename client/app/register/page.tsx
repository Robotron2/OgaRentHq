"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, UserCircle, Home, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<"renter" | "landlord">("renter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Registration successful for ${accountType} account!`);
    }, 1500);
  };

  return (
    <div className="flex min-h-[calc(100vh-6rem)] bg-surface items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row-reverse border border-outline-variant/20"
      >
        {/* Visual Side (Right side for register to differentiate from login) */}
        <div className="md:w-1/2 relative min-h-[200px] md:min-h-full hidden md:block">
          <Image
            src="/house2.webp"
            alt="Luxury apartment view"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-10 text-white">
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-display-lg text-4xl mb-4"
            >
              Join the future of renting.
            </motion.h2>
            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex items-center gap-3 text-white/90"
              >
                <CheckCircle2 size={20} className="text-[#a2d1b9]" />
                <span>100% Secure Escrow Protocol</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center gap-3 text-white/90"
              >
                <CheckCircle2 size={20} className="text-[#a2d1b9]" />
                <span>Verified High-Fidelity Listings</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="font-display-lg text-3xl text-primary mb-2">Create Account</h1>
            <p className="text-on-surface-variant">Join OgaRent to experience secure property transactions.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* Account Type Selector */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary block">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAccountType("renter")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    accountType === "renter" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-outline-variant/30 text-outline hover:border-primary/50"
                  }`}
                >
                  <UserCircle size={24} />
                  <span className="font-label-caps text-xs font-bold">Renter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("landlord")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    accountType === "landlord" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-outline-variant/30 text-outline hover:border-primary/50"
                  }`}
                >
                  <Home size={24} />
                  <span className="font-label-caps text-xs font-bold">Landlord</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-on-surface"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-on-surface"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-on-surface"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-label-caps font-bold py-4 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create {accountType === 'renter' ? 'Renter' : 'Landlord'} Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
