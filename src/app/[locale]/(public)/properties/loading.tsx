export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-6 w-96 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Filter Skeleton */}
        <div className="bg-gradient-to-br from-spotBeige/30 to-white border border-spotBeige rounded-xl mb-8 overflow-hidden shadow-sm">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 h-12 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Results Count Skeleton */}
        <div className="mb-6">
          <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-64 bg-gray-200 animate-pulse" />
              <div className="p-5">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse mb-3" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="flex gap-4">
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
