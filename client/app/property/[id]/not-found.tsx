import Link from 'next/link'
import { Building2, Home } from 'lucide-react'

export default function PropertyNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6 text-outline">
        <Building2 size={40} className="opacity-50" />
      </div>
      <h1 className="font-display-lg text-primary mb-4">Property Not Found</h1>
      <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-8">
        We couldn't find the property you're looking for. It might have been removed or the link might be incorrect.
      </p>
      <Link 
        href="/"
        className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-headline-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
      >
        <Home size={20} />
        Back to Marketplace
      </Link>
    </div>
  )
}
