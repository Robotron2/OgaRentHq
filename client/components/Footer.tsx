import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest mt-stack-lg border-t border-outline-variant/20">
      <div className="w-full py-stack-lg px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto">
        <div className="md:col-span-1 flex flex-col items-start">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="OgaRent Logo" width={140} height={40} className="object-contain object-left -ml-3" />
          </Link>
          <p className="text-sm text-on-surface-variant mt-4 leading-relaxed">
            Nigeria&apos;s first high-fidelity property escrow platform. Building trust between landlords and tenants through architectural transparency and financial security.
          </p>
        </div>
        
        <div>
          <h5 className="font-bold text-primary mb-4">Marketplace</h5>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><Link className="hover:text-primary transition-colors" href="#">Find a Home</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="#">List your Property</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="#">Luxury Collection</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-bold text-primary mb-4">Resources</h5>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><Link className="hover:text-primary transition-colors" href="#">Tenancy Laws</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="#">Escrow Guide</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="#">Market Report 2024</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-bold text-primary mb-4">Legal</h5>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li><Link className="hover:text-primary transition-colors underline decoration-primary/20" href="#">Privacy Policy</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link></li>
            <li><Link className="hover:text-primary transition-colors" href="#">Security Standards</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-container-max mx-auto px-margin-desktop py-stack-md border-t border-outline-variant/10 text-center md:text-left">
        <p className="text-[12px] text-outline">
          © {new Date().getFullYear()} OgaRent Nigeria. All rights reserved. Built for Trust.
        </p>
      </div>
    </footer>
  );
}
