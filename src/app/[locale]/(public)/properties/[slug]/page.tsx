import { Suspense } from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { DollarSign } from "lucide-react";
import PropertyContactForm from "./property-contact-form";
import { PropertyWhatsAppCTA } from "@/components/whatsapp/property-whatsapp-cta";
import { PropertyHeader } from "./property-header";
import { PropertyFeatures } from "./property-features";
import { PropertyDetailsTable } from "./property-details-table";
import { PropertyGallery } from "./property-gallery";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { cleanBaseUrl } from "@/lib/env";

interface PropertyDetailPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const property = await db.property.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    select: {
      title: true,
      description: true,
      price: true,
      city: true,
      country: true,
      images: {
        where: { isPrimary: true },
        select: { url: true },
        take: 1,
      },
    },
  });

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  const canonicalUrl = `${cleanBaseUrl}/${locale}/properties/${slug}`;
  const primaryImage = property.images[0]?.url;

  return {
    title: `${property.title} - ${property.city}, ${property.country}`,
    description: property.description || `Premium property in ${property.city}, ${property.country}. Price: $${property.price.toLocaleString()}`,
    openGraph: {
      title: property.title,
      description: property.description || `Premium property in ${property.city}, ${property.country}`,
      url: canonicalUrl,
      images: primaryImage ? [{ url: primaryImage, alt: property.title }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: property.description || `Premium property in ${property.city}, ${property.country}`,
      images: primaryImage ? [primaryImage] : [],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${cleanBaseUrl}/en/properties/${slug}`,
        ar: `${cleanBaseUrl}/ar/properties/${slug}`,
      },
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-spot-beige">
      <Suspense fallback={<PropertyDetailSkeleton />}>
        <PropertyDetailContent slug={slug} />
      </Suspense>
    </div>
  );
}

// Server Component - Fetches and renders property details
async function PropertyDetailContent({ slug }: { slug: string }) {
  const t = await getTranslations("propertyDetail");

  // Optimized Prisma query - only fetch necessary fields
  const property = await db.property.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      currency: true,
      type: true,
      status: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      yearBuilt: true,
      city: true,
      region: true,
      country: true,
      description: true,
      parkingSpaces: true,
      floor: true,
      landArea: true,
      rooms: true,
      images: {
        select: {
          id: true,
          url: true,
          isPrimary: true,
        },
        orderBy: [
          { isPrimary: "desc" },
          { order: "asc" },
        ],
      },
    },
  });

  if (!property) {
    notFound();
  }

  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

  // Only get non-primary images for gallery
  const galleryImages = property.images.length > 1
    ? property.images.map(img => ({ id: img.id, url: img.url }))
    : [];

  return (
    <>
      {/* Hero Header */}
      <PropertyHeader
        title={property.title}
        status={property.status}
        imageUrl={primaryImage?.url}
        city={property.city}
        region={property.region}
        country={property.country}
      />

      {/* Main Content */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Price */}
              <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-4 sm:p-6">
                <div className="flex items-center gap-2 text-spot-dark/70 mb-2">
                  <DollarSign className="w-5 h-5 text-spot-red" />
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    {t("price")}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-spot-red">
                  ${property.price.toLocaleString()} {property.currency}
                </div>
              </div>

              {/* Key Features */}
              <PropertyFeatures
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                yearBuilt={property.yearBuilt}
                translations={{
                  title: t("keyFeatures"),
                  bedrooms: t("bedrooms"),
                  bathrooms: t("bathrooms"),
                  area: t("area"),
                  yearBuilt: t("yearBuilt"),
                }}
              />

              {/* Description */}
              {property.description && (
                <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-spot-dark mb-3 sm:mb-4">
                    {t("description")}
                  </h2>
                  <p className="text-sm sm:text-base text-spot-dark/80 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Additional Details */}
              <PropertyDetailsTable
                type={property.type}
                status={property.status}
                landArea={property.landArea}
                floor={property.floor}
                parkingSpaces={property.parkingSpaces}
                rooms={property.rooms}
                translations={{
                  title: t("propertyDetails"),
                  type: t("type"),
                  status: t("status"),
                  landArea: t("landArea"),
                  floor: t("floor"),
                  parking: t("parking"),
                  spaces: t("spaces"),
                  rooms: t("rooms"),
                }}
              />

              {/* Image Gallery */}
              {galleryImages.length > 0 && (
                <PropertyGallery
                  images={galleryImages}
                  propertyTitle={property.title}
                  galleryTitle={t("gallery")}
                />
              )}
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-1">
              <PropertyContactForm
                propertyId={property.id}
                propertyTitle={property.title}
                propertySlug={property.slug}
                translations={{
                  interestedTitle: t("interestedTitle"),
                  contactTab: t("contactTab"),
                  bookVisitTab: t("bookVisitTab"),
                  chatWhatsApp: t("chatWhatsApp"),
                  name: t("name"),
                  namePlaceholder: t("namePlaceholder"),
                  emailPlaceholder: t("emailPlaceholder"),
                  phone: t("phone"),
                  phonePlaceholder: t("phonePlaceholder"),
                  message: t("message"),
                  messagePlaceholder: t("messagePlaceholder"),
                  preferredDateTime: t("preferredDateTime"),
                  anyRequests: t("anyRequests"),
                  sendMessage: t("sendMessage"),
                  sending: t("sending"),
                  bookVisit: t("bookVisit"),
                  booking: t("booking"),
                  contactSuccess: t("contactSuccess"),
                  appointmentSuccess: t("appointmentSuccess"),
                  required: t("required"),
                }}
              />
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-12">
            <PropertyWhatsAppCTA
              propertyTitle={property.title}
              propertySlug={property.slug}
              translations={{
                title: t("whatsappTitle"),
                subtitle: t("whatsappSubtitle"),
                buttonText: t("startWhatsAppChat"),
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

// Skeleton component for loading state
function PropertyDetailSkeleton() {
  return (
    <>
      {/* Hero Skeleton */}
      <div className="relative h-[60vh] bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                    <div key={i} className="flex flex-col items-center p-4 bg-spot-beige rounded-lg">
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
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="space-y-4">
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
