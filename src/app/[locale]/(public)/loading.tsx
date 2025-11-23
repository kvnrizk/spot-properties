export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-spot-beige animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative h-[600px] bg-gray-300">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center">
          <div className="h-12 bg-gray-400 rounded w-3/4 max-w-2xl mb-4" />
          <div className="h-6 bg-gray-400 rounded w-1/2 max-w-xl mb-8" />

          {/* Search Form Skeleton */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-xl w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Section Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="h-10 bg-gray-300 rounded w-64 mb-8 mx-auto" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="h-64 bg-gray-300" />
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-4" />
                <div className="flex gap-4 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded w-24" />
                </div>
                <div className="h-10 bg-gray-300 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <div className="bg-gray-300 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="h-10 bg-gray-400 rounded w-96 mb-4 mx-auto" />
          <div className="h-6 bg-gray-400 rounded w-64 mb-8 mx-auto" />
          <div className="flex gap-4 justify-center">
            <div className="h-12 bg-gray-400 rounded w-40" />
            <div className="h-12 bg-gray-400 rounded w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
