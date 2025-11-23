export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-spot-beige">
      {/* Hero Skeleton */}
      <div className="relative h-[60vh] bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Price Skeleton */}
              <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Features Skeleton */}
              <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center p-4 bg-spot-beige rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Skeleton */}
              <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Details Table Skeleton */}
              <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-3 border-b border-spot-dark/10"
                    >
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery Skeleton */}
              <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="relative h-48 rounded-lg bg-gray-200 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6" />

                {/* Tabs Skeleton */}
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* WhatsApp Button Skeleton */}
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse mb-6" />

                {/* Form Fields Skeleton */}
                <div className="space-y-4">
                  <div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA Skeleton */}
          <div className="mt-12 bg-spot-beige rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-14 w-64 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
