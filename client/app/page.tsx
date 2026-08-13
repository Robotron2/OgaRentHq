import React from "react";
import { properties } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import { Search, Map } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="w-full bg-gradient-to-b from-surface-container-low to-surface border-b border-outline-variant/10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center flex flex-col items-center">
          <span className="font-label-caps text-primary tracking-widest mb-4 bg-primary/10 px-4 py-1 rounded-full">OgaRent Marketplace</span>
          <h1 className="font-display-lg text-primary max-w-3xl mb-6">Find Your Next Home, Protected On-Chain.</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mb-10">Browse verified properties across Nigeria. Secure your rental agreement with smart contracts and pay with total peace of mind.</p>
          
          <div className="flex w-full max-w-2xl bg-white p-2 rounded-2xl shadow-sm border border-outline-variant/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <div className="flex-1 flex items-center gap-3 px-4 border-r border-outline-variant/30">
              <Search className="text-on-surface-variant/50" />
              <input type="text" placeholder="Search by neighborhood or property type..." className="w-full py-3 outline-none text-on-surface placeholder:text-on-surface-variant/50 bg-transparent" />
            </div>
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-headline-lg text-primary mb-2">Available Properties</h2>
            <p className="text-on-surface-variant">Showing {properties.length} verified listings ready for smart escrow.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-primary font-medium hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors border border-outline-variant/30">
            <Map size={18} />
            View on Map
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
    </>
  );
}
