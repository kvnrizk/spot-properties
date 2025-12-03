"use client";

import { Search, MapPin, Bed, Bath, Home, Building2, TreePine, Briefcase, Plane, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { generateWhatsAppLink, getDefaultWhatsAppMessage } from "@/lib/whatsapp";

interface Property {
  id: string;
  slug: string;
  title: string;
  city: string;
  country: string;
  region: string | null;
  price: number;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
}

interface HomePageClientProps {
  properties: Property[];
}

export function HomePageClient({ properties }: HomePageClientProps) {
  return (
    <div className="min-h-screen bg-spot-beige">
      <Hero />
      <CountrySection />
      <CategorySection />
      <FeaturedSection properties={properties} />
      <AboutSection />
      <CTASection />
    </div>
  );
}

function Hero() {
  const t = useTranslations();

  return (
    <section className="relative min-h-[600px] h-[85vh] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-spot-dark/70 via-spot-dark/50 to-spot-dark/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <p className="text-white/90 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-6 font-light">
          LEBANON • CYPRUS
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 tracking-tight px-2">
          {t("hero.title")}
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto font-light px-4">
          {t("hero.subtitle")}
        </p>

        {/* Search Bar */}
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-2xl p-4 sm:p-6 border-2 border-spot-dark/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Country Select */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
                {t("hero.country")}
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 pr-10 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors appearance-none cursor-pointer">
                  <option>{t("hero.allCountries")}</option>
                  <option>{t("nav.lebanon")}</option>
                  <option>{t("nav.cyprus")}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-spot-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Type Select */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
                {t("hero.type")}
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 pr-10 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors appearance-none cursor-pointer">
                  <option>{t("hero.allTypes")}</option>
                  <option>{t("categories.apartments")}</option>
                  <option>{t("categories.villas")}</option>
                  <option>{t("categories.land")}</option>
                  <option>{t("categories.offices")}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-spot-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Min Price */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
                {t("hero.minPrice")}
              </label>
              <input
                type="text"
                placeholder="$0"
                className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
              />
            </div>

            {/* Max Price */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
                {t("hero.maxPrice")}
              </label>
              <input
                type="text"
                placeholder="Any"
                className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
              />
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1 flex items-end">
              <button className="w-full bg-spot-red hover:bg-spot-red/90 text-white font-semibold py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center gap-2 border-2 border-spot-red hover:shadow-lg">
                <Search className="w-5 h-5" />
                {t("hero.searchButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountrySection() {
  const t = useTranslations();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Lebanon Card */}
          <div className="relative group overflow-hidden rounded-lg border-4 border-spot-dark/20 hover:border-spot-red transition-all duration-300 min-h-[300px] sm:h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-spot-beige to-spot-beige/50">
              <div className="absolute inset-0 opacity-10 bg-[url('/lebanon-pattern.jpg')] bg-cover bg-center" />
            </div>

            <div className="relative h-full p-6 sm:p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-spot-dark mb-4 sm:mb-6 tracking-tight">
                {t("lebanon.title")}
              </h2>
              <p className="text-base sm:text-lg text-spot-dark/80 mb-6 sm:mb-8 max-w-md font-light leading-relaxed">
                {t("lebanon.description")}
              </p>
              <div>
                <Link href="/lebanon">
                  <button className="bg-spot-red hover:bg-spot-red/90 text-white font-semibold py-3 px-8 rounded-md transition-all duration-200 border-2 border-spot-red inline-flex items-center gap-2 group-hover:shadow-lg">
                    {t("lebanon.viewListings")}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Cyprus Card */}
          <div className="relative group overflow-hidden rounded-lg border-4 border-spot-dark/20 hover:border-spot-red transition-all duration-300 min-h-[300px] sm:h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-spot-beige to-spot-beige/50">
              <div className="absolute inset-0 opacity-10 bg-[url('/cyprus-pattern.jpg')] bg-cover bg-center" />
            </div>

            <div className="relative h-full p-6 sm:p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-spot-dark mb-4 sm:mb-6 tracking-tight">
                {t("cyprus.title")}
              </h2>
              <p className="text-base sm:text-lg text-spot-dark/80 mb-6 sm:mb-8 max-w-md font-light leading-relaxed">
                {t("cyprus.description")}
              </p>
              <div>
                <Link href="/cyprus">
                  <button className="bg-spot-red hover:bg-spot-red/90 text-white font-semibold py-3 px-8 rounded-md transition-all duration-200 border-2 border-spot-red inline-flex items-center gap-2 group-hover:shadow-lg">
                    {t("cyprus.viewListings")}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategorySection() {
  const t = useTranslations();

  const categories = [
    { icon: Building2, title: t("categories.apartments") },
    { icon: Home, title: t("categories.villas") },
    { icon: TreePine, title: t("categories.land") },
    { icon: Briefcase, title: t("categories.offices") },
    { icon: Plane, title: t("categories.airbnb") },
    { icon: LayoutGrid, title: t("categories.other") },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-spot-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-spot-dark text-center mb-4 tracking-tight uppercase tracking-wide">
          {t("categories.title")}
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-spot-red mx-auto mb-8 sm:mb-12 md:mb-16" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group bg-white rounded-lg border-2 border-spot-dark/20 p-4 sm:p-6 md:p-8 text-center hover:border-spot-red hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full bg-spot-beige group-hover:bg-spot-red/10 flex items-center justify-center transition-colors">
                <category.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-spot-red" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-spot-dark group-hover:text-spot-red transition-colors">
                {category.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeaturedSectionProps {
  properties: Property[];
}

function FeaturedSection({ properties }: FeaturedSectionProps) {
  const t = useTranslations();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-spot-dark text-center mb-4 tracking-tight uppercase tracking-wide">
          {t("featured.title")}
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-spot-red mx-auto mb-8 sm:mb-12 md:mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => {
            const primaryImage = property.images.find((img) => img.isPrimary);
            const location = property.region
              ? `${property.region}, ${property.city}`
              : `${property.city}, ${property.country}`;
            const statusDisplay = property.status.replace("_", " ");

            return (
              <Link
                key={property.id}
                href={`/properties/${property.slug}`}
                className="group bg-white rounded-lg border-2 border-spot-dark/20 overflow-hidden hover:border-spot-red hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-64 bg-gradient-to-br from-spot-beige to-spot-dark/10 overflow-hidden">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-spot-dark/10 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-spot-red text-white text-xs font-bold px-4 py-2 rounded-md uppercase tracking-wider border-2 border-white">
                      {statusDisplay}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-spot-dark mb-2 group-hover:text-spot-red transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-2 text-spot-dark/70 mb-4">
                    <MapPin className="w-4 h-4 text-spot-red" />
                    <span className="text-sm">{location}</span>
                  </div>

                  {(property.bedrooms || property.bathrooms) && (
                    <div className="flex items-center gap-6 text-spot-dark/70 mb-6 pb-6 border-b-2 border-spot-dark/10">
                      {property.bedrooms && (
                        <div className="flex items-center gap-2">
                          <Bed className="w-5 h-5 text-spot-red" />
                          <span className="text-sm font-medium">{property.bedrooms} {t("featured.beds")}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-2">
                          <Bath className="w-5 h-5 text-spot-red" />
                          <span className="text-sm font-medium">{property.bathrooms} {t("featured.baths")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-spot-red">
                      ${property.price.toLocaleString()}
                    </span>
                    <span className="text-spot-dark group-hover:text-spot-red font-semibold transition-colors">
                      {t("featured.viewDetails")} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const t = useTranslations();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-spot-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-spot-dark mb-4 tracking-tight uppercase tracking-wide">
              {t("about.title")}
            </h2>
            <p className="text-lg sm:text-xl text-spot-red font-semibold mb-6 sm:mb-8">
              {t("about.subtitle")}
            </p>
            <p className="text-base sm:text-lg text-spot-dark/80 leading-relaxed font-light">
              {t("about.body")}
            </p>
          </div>

          {/* Video Block */}
          <div className="relative h-[250px] sm:h-[300px] md:h-[400px] rounded-lg border-4 border-spot-dark/20 overflow-hidden">
            <video
              className="w-full h-full object-cover"
              autoPlay
              controls
              muted
              loop
              playsInline
            >
              <source src="/info.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const t = useTranslations();

  const handleWhatsAppClick = () => {
    const message = getDefaultWhatsAppMessage();
    const link = generateWhatsAppLink(message);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#ecddc9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-spot-dark mb-4 tracking-tight">
          {t("cta.title")}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-spot-dark/80 mb-8 sm:mb-12 font-light">
          {t("cta.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <Link href="/contact">
            <button className="w-full sm:w-auto bg-spot-dark hover:bg-spot-dark/90 text-white font-semibold py-3 sm:py-4 px-8 sm:px-10 rounded-md transition-all duration-200 border-2 border-spot-dark hover:shadow-2xl text-base sm:text-lg">
              {t("cta.contact")}
            </button>
          </Link>
          <button
            onClick={handleWhatsAppClick}
            className="w-full sm:w-auto bg-transparent hover:bg-spot-dark/5 text-spot-dark font-semibold py-3 sm:py-4 px-8 sm:px-10 rounded-md transition-all duration-200 border-2 border-spot-dark text-base sm:text-lg"
          >
            {t("cta.whatsapp")}
          </button>
        </div>
      </div>
    </section>
  );
}
