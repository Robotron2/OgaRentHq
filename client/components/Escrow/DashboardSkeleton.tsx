export default function DashboardSkeleton() {
  return (
    <div className="pb-20 relative max-w-6xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outline-variant/30 mb-8">
        <div className="w-full">
          <div className="h-10 bg-outline-variant/20 rounded-lg w-2/3 md:w-1/3 mb-4"></div>
          <div className="h-4 bg-outline-variant/20 rounded w-full max-w-xl mb-2"></div>
          <div className="h-4 bg-outline-variant/20 rounded w-4/5 max-w-lg"></div>
        </div>
        <div className="h-12 bg-outline-variant/20 rounded-full w-48 shrink-0"></div>
      </div>

      {/* Overview Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-5 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-outline-variant/20"></div>
            <div>
              <div className="h-3 bg-outline-variant/20 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-outline-variant/20 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Rental Skeleton */}
      <div className="mb-12">
        <div className="h-8 bg-outline-variant/20 rounded w-48 mb-6"></div>
        <div className="bg-surface-container-lowest rounded-3xl h-64 md:h-80 w-full border border-outline-variant/20"></div>
      </div>

      {/* List Skeleton */}
      <div>
        <div className="h-6 bg-outline-variant/20 rounded w-40 mb-6"></div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 w-full"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
