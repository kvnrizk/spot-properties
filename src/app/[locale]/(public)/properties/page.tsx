import { Suspense } from "react";
import {
  parseFiltersFromSearchParams,
  getProperties,
  getPropertiesCount,
} from "@/lib/properties";
import { Link } from "@/i18n/navigation";
import { PropertiesFilter } from "./properties-filter";
import { PropertyCard } from "./property-card";
import { Pagination } from "./pagination";
import { getTranslations } from "next-intl/server";

interface PropertiesPageProps {
  searchParams: Promise<{
    country?: string;
    city?: string;
    type?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const t = await getTranslations();
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-spotDark mb-2">{t("propertiesPage.title")}</h1>
          <p className="text-gray-600">{t("propertiesPage.subtitle")}</p>
        </div>

        {/* Filters - No Suspense needed, minimal client-side logic */}
        <PropertiesFilter searchParams={params} />

        {/* Properties List - Wrapped in Suspense */}
        <Suspense
          fallback={
            <div className="space-y-6">
              <PropertiesListSkeleton />
            </div>
          }
        >
          <PropertiesList searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}

// Server Component - Fetches and renders properties
async function PropertiesList({ searchParams }: { searchParams: {
  country?: string;
  city?: string;
  type?: string;
  status?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  page?: string;
  sort?: string;
} }) {
  const t = await getTranslations();
  const filters = parseFiltersFromSearchParams(searchParams);
  const perPage = filters.perPage || 12;
  const page = filters.page || 1;
  const skip = (page - 1) * perPage;

  // Parallel fetch for properties and count
  const [properties, total] = await Promise.all([
    getProperties(filters),
    getPropertiesCount(filters),
  ]);

  const totalPages = Math.ceil(total / perPage);

  if (total === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{t("propertiesPage.noProperties")}</p>
        <Link
          href="/properties"
          className="mt-4 inline-block text-spotRed hover:underline"
        >
          {t("propertiesPage.clearFilters")}
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Results Count */}
      <div className="mb-6 text-sm text-gray-600">
        {t("propertiesPage.showing")} {skip + 1}-{Math.min(skip + perPage, total)}{" "}
        {t("propertiesPage.of")} {total} {t("propertiesPage.propertiesText")}
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            translations={{
              forSale: t("propertiesPage.forSale"),
              forRent: t("propertiesPage.forRent"),
              month: t("propertiesPage.month"),
              beds: t("featured.beds"),
              baths: t("featured.baths"),
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          searchParams={searchParams}
          translations={{
            previous: t("propertiesPage.previous"),
            next: t("propertiesPage.next"),
            page: t("propertiesPage.page"),
            of: t("propertiesPage.of"),
          }}
        />
      )}
    </>
  );
}

// Skeleton component for loading state
function PropertiesListSkeleton() {
  return (
    <>
      <div className="mb-6">
        <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
      </div>

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
    </>
  );
}
