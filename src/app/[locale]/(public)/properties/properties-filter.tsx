import { PropertyType, PropertyStatus } from "@prisma/client";
import { parseFiltersFromSearchParams } from "@/lib/properties";
import { getTranslations, getLocale } from "next-intl/server";
import { FilterForm } from "./filter-form";

interface PropertiesFilterProps {
  searchParams: {
    country?: string;
    city?: string;
    type?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    page?: string;
    sort?: string;
  };
}

export async function PropertiesFilter({ searchParams }: PropertiesFilterProps) {
  const t = await getTranslations();
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const filters = parseFiltersFromSearchParams(searchParams);

  // Prepare translations object for client component
  const translations = {
    title: t("filters.title"),
    country: t("filters.country"),
    allCountries: t("filters.allCountries"),
    lebanon: isRTL ? "لبنان" : "Lebanon",
    cyprus: isRTL ? "قبرص" : "Cyprus",
    city: t("filters.city"),
    cityPlaceholder: t("filters.cityPlaceholder"),
    propertyType: t("filters.propertyType"),
    anyType: t("filters.anyType"),
    apartment: t("filters.types.apartment"),
    house: t("filters.types.house"),
    villa: t("filters.types.villa"),
    land: t("filters.types.land"),
    office: t("filters.types.office"),
    airbnb: t("filters.types.airbnb"),
    other: t("filters.types.other"),
    status: t("filters.status"),
    anyStatus: t("filters.anyStatus"),
    forSale: t("filters.statuses.forSale"),
    forRent: t("filters.statuses.forRent"),
    minPrice: t("filters.minPrice"),
    minPricePlaceholder: t("filters.minPricePlaceholder"),
    maxPrice: t("filters.maxPrice"),
    maxPricePlaceholder: t("filters.maxPricePlaceholder"),
    bedrooms: t("filters.bedrooms"),
    anyBedrooms: t("filters.anyBedrooms"),
    sortBy: t("filters.sortBy"),
    newest: t("filters.sort.newest"),
    oldest: t("filters.sort.oldest"),
    priceLowToHigh: t("filters.sort.priceLowToHigh"),
    priceHighToLow: t("filters.sort.priceHighToLow"),
    applyFilters: t("filters.applyFilters"),
    resetFilters: t("filters.resetFilters"),
  };

  return (
    <FilterForm
      initialFilters={{
        country: filters.country || "",
        city: filters.city || "",
        type: filters.type || "",
        status: filters.status || "",
        minPrice: filters.minPrice?.toString() || "",
        maxPrice: filters.maxPrice?.toString() || "",
        bedrooms: filters.bedrooms?.toString() || "",
        sort: filters.sort || "newest",
      }}
      translations={translations}
      isRTL={isRTL}
      propertyTypes={PropertyType}
      propertyStatuses={PropertyStatus}
    />
  );
}
