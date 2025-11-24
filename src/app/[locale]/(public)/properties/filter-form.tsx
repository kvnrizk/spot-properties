"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

interface FilterFormProps {
  initialFilters: {
    country: string;
    city: string;
    type: string;
    status: string;
    minPrice: string;
    maxPrice: string;
    bedrooms: string;
    sort: string;
  };
  translations: Record<string, string>;
  isRTL: boolean;
  propertyTypes: any;
  propertyStatuses: any;
}

export function FilterForm({
  initialFilters,
  translations,
  isRTL,
  propertyTypes,
  propertyStatuses,
}: FilterFormProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== "sort") {
        params.set(key, value);
      }
    });

    // Only add sort if it's not the default
    if (filters.sort && filters.sort !== "newest") {
      params.set("sort", filters.sort);
    }

    router.push(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleReset = () => {
    setFilters({
      country: "",
      city: "",
      type: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      sort: "newest",
    });
    router.push("/properties");
  };

  return (
    <div className="bg-gradient-to-br from-spotBeige/30 to-white border border-spotBeige rounded-xl mb-8 overflow-hidden shadow-sm">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between p-4 bg-spotBeige/20 border-b border-spotBeige/30">
        <h2 className="text-lg font-semibold text-spotDark flex items-center gap-2">
          <svg
            className="w-5 h-5 text-spotRed"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {translations.title}
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden px-3 py-1.5 text-sm text-spotDark hover:text-spotRed transition-colors"
          aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Filter Form */}
      <div className={`${isExpanded ? "block" : "hidden lg:block"}`}>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className={`block text-sm font-medium text-spotDark mb-2 ${isRTL ? "text-right" : "text-left"}`}
              >
                {translations.country}
              </label>
              <select
                id="country"
                value={filters.country}
                onChange={(e) => handleFilterChange("country", e.target.value)}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotRed focus:border-transparent bg-white text-spotDark transition-all ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="">{translations.allCountries}</option>
                <option value="Lebanon">{translations.lebanon}</option>
                <option value="Cyprus">{translations.cyprus}</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className={`block text-sm font-medium text-spotDark mb-2 ${isRTL ? "text-right" : "text-left"}`}
              >
                {translations.city}
              </label>
              <input
                type="text"
                id="city"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                placeholder={translations.cityPlaceholder}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotRed focus:border-transparent bg-white text-spotDark transition-all ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Property Type */}
            <div>
              <label
                htmlFor="type"
                className={`block text-sm font-medium text-spotDark mb-2 ${isRTL ? "text-right" : "text-left"}`}
              >
                {translations.propertyType}
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotRed focus:border-transparent bg-white text-spotDark transition-all ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="">{translations.anyType}</option>
                <option value={propertyTypes.APARTMENT}>{translations.apartment}</option>
                <option value={propertyTypes.HOUSE}>{translations.house}</option>
                <option value={propertyTypes.VILLA}>{translations.villa}</option>
                <option value={propertyTypes.LAND}>{translations.land}</option>
                <option value={propertyTypes.OFFICE}>{translations.office}</option>
                <option value={propertyTypes.AIRBNB}>{translations.airbnb}</option>
                <option value={propertyTypes.OTHER}>{translations.other}</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className={`block text-sm font-medium text-spotDark mb-2 ${isRTL ? "text-right" : "text-left"}`}
              >
                {translations.status}
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotRed focus:border-transparent bg-white text-spotDark transition-all ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="">{translations.anyStatus}</option>
                <option value={propertyStatuses.FOR_SALE}>{translations.forSale}</option>
                <option value={propertyStatuses.FOR_RENT}>{translations.forRent}</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label
                htmlFor="minPrice"
                className={`block text-sm font-medium text-spotDark mb-2 ${isRTL ? "text-right" : "text-left"}`}
              >
                {translations.minPrice}
              </label>
              <input
                type="number"
                id="minPrice"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                placeholder={translations.minPricePlaceholder}
                min="0"
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotRed focus:border-transparent bg-white text-spotDark transition-all ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Max Price */}
            <div>
              <label
                htmlFor="maxPrice"
                className={`block text-sm font-medium text-spotDark mb-2 ${isRTL ? "text-right" : "text-left"}`}
              >
                {translations.maxPrice}
              </label>
              <input
                type="number"
                id="maxPrice"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                placeholder={translations.maxPricePlaceholder}
                min="0"
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotRed focus:border-transparent bg-white text-spotDark transition-all ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label
                htmlFor="bedrooms"
                className={`block text-sm font-medium text-spotDark mb-2 ${isRTL ? "text-right" : "text-left"}`}
              >
                {translations.bedrooms}
              </label>
              <select
                id="bedrooms"
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotRed focus:border-transparent bg-white text-spotDark transition-all ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="">{translations.anyBedrooms}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label
                htmlFor="sort"
                className={`block text-sm font-medium text-spotDark mb-2 ${isRTL ? "text-right" : "text-left"}`}
              >
                {translations.sortBy}
              </label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotRed focus:border-transparent bg-white text-spotDark transition-all ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="newest">{translations.newest}</option>
                <option value="oldest">{translations.oldest}</option>
                <option value="price_low_to_high">{translations.priceLowToHigh}</option>
                <option value="price_high_to_low">{translations.priceHighToLow}</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-3 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-6 py-3 rounded-lg transition-all font-medium text-center shadow-sm hover:shadow-md"
              style={{
                backgroundColor: '#9b1f1f',
                color: '#ffffff',
                border: '2px solid #9b1f1f'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7d1919';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#9b1f1f';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              {translations.applyFilters}
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 rounded-lg transition-all font-medium text-center shadow-sm"
              style={{
                backgroundColor: '#ffffff',
                color: '#1f1b18',
                border: '2px solid #1f1b18'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1f1b18';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#1f1b18';
              }}
            >
              {translations.resetFilters}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
