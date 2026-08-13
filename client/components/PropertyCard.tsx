import Image from 'next/image'
import Link from 'next/link'
import { MapPin, BedDouble, Bath } from 'lucide-react'
import { Property } from '@/data/properties'
import { formatUnits } from 'viem'

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/property/${property.id}`} className="group flex flex-col bg-white rounded-2xl border border-outline-variant/30 overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all hover:border-primary/50 cursor-pointer h-full">
      <div className="relative h-56 w-full overflow-hidden">
        <Image 
          src={property.images[0]} 
          alt={property.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
          {property.propertyType}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-4 flex-grow">
        <div>
          <h3 className="font-headline-sm text-primary group-hover:text-primary/80 transition-colors line-clamp-1">{property.title}</h3>
          <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1.5">
            <MapPin size={16} className="shrink-0 text-primary/60" />
            <span className="truncate">{property.location}</span>
          </p>
        </div>
        
        <div className="flex gap-6 text-sm text-on-surface-variant font-medium py-1">
          <div className="flex items-center gap-2">
            <BedDouble size={18} className="text-primary/60" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath size={18} className="text-primary/60" />
            <span>{property.bathrooms} Bath</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Annual Rent</span>
            <span className="text-xl font-bold text-primary">
              {formatUnits(property.rentAmount, 6)} <span className="text-sm font-medium opacity-80">mUSDC</span>
            </span>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors">
            View Details
          </div>
        </div>
      </div>
    </Link>
  )
}
