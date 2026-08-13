import React from "react";
import HeroGallery from "@/components/HeroGallery";
import TrustHighlights from "@/components/TrustHighlights";
import TrustTimeline from "@/components/TrustTimeline";
import CheckoutCard from "@/components/CheckoutCard";
import PropertyOverview from "@/components/PropertyOverview";
import { MapPin } from "lucide-react";
import { properties } from "@/data/properties";
import { notFound } from "next/navigation";
import { formatUnits } from "viem";

export function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id,
  }));
}

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === params.id);
  
  if (!property) {
    notFound();
  }

  return (
    <>
      <section className="w-full bg-gradient-to-b from-surface-container-low to-surface border-b border-outline-variant/10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-6 pb-stack-lg">
          <HeroGallery images={property.images} />
        </div>
      </section>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        <div className="flex flex-col lg:flex-row gap-gutter">
          <div className="lg:w-2/3 space-y-stack-lg">
            <div className="border-b border-outline-variant/10 pb-stack-md">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="font-display-lg text-headline-md text-primary mb-2">
                    {property.title}
                  </h1>
                  <p className="text-on-surface-variant flex items-center gap-2">
                    <MapPin size={16} />
                    {property.location}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-display-lg text-headline-md text-primary">
                    {formatUnits(property.rentAmount, 6)} mUSDC
                  </span>
                  <span className="text-on-surface-variant text-sm font-label-caps">
                    PER ANNUM
                  </span>
                </div>
              </div>
            </div>

            <TrustHighlights />
            <TrustTimeline />
          </div>

          <div className="lg:w-1/3">
            <CheckoutCard property={property} />
          </div>
        </div>

        <PropertyOverview property={property} />
      </main>
    </>
  );
}
