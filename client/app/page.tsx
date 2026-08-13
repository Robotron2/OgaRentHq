"use client";

import React, { useState, useMemo } from "react";
import { properties, PropertyCategory } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import Hero from "@/components/Hero";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FilterCategory = PropertyCategory | "All";
const categories: FilterCategory[] = ["All", "Apartment", "Duplex", "Studio", "Luxury", "House", "Commercial"];
const ITEMS_PER_PAGE = 9;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProperties = useMemo(() => {
    if (activeCategory === "All") return properties;
    return properties.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE) || 1;
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: FilterCategory) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <>
      {/* ── Cinematic Hero ──────────────────────────────────────────────── */}
      <Hero />

      {/* ── Marketplace Section ─────────────────────────────────────────── */}
      <section className="bg-surface border-b border-outline-variant/20 sticky top-20 md:top-24 z-30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border shrink-0 ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                  : "bg-white text-on-surface hover:border-primary/40 border-outline-variant/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg min-h-[50vh]">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-headline-lg text-primary mb-2">Available Properties</h2>
            <p className="text-on-surface-variant">
              Showing {filteredProperties.length} verified listings ready for smart escrow.
            </p>
          </div>
        </div>

        {paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-outline-variant/30">
            <p className="font-headline-md text-on-surface-variant">
              No properties found in this category.
            </p>
            <button
              onClick={() => handleCategoryChange("All")}
              className="mt-4 text-primary font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors border border-outline-variant/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high bg-white"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <span className="font-medium text-on-surface-variant">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors border border-outline-variant/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high bg-white"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>
    </>
  );
}
