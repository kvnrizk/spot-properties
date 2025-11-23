import { db } from "@/lib/db";
import { PropertyWithImages } from "@/lib/properties";
import { PropertyStatus } from "@prisma/client";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("cyprus.pageTitle"),
    description: t("cyprus.pageSubtitle"),
  };
}

export default async function CyprusPage() {
  const properties = await db.property.findMany({
    where: {
      country: "Cyprus",
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: {
          isPrimary: "desc",
        },
        take: 1,
      },
    },
  });

  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-spotDark mb-2">{t("cyprus.pageTitle")}</h1>
          <p className="text-gray-600">
            {t("cyprus.pageSubtitle")}
          </p>
        </div>

        {properties.length > 0 ? (
          <>
            <div className="mb-6 text-sm text-gray-600">
              {properties.length} {t("propertiesPage.propertiesText")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property as PropertyWithImages}
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
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("cyprus.noProperties")}</p>
            <Link
              href="/properties"
              className="mt-4 inline-block text-spotRed hover:underline"
            >
              {t("nav.properties")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({
  property,
  translations,
}: {
  property: PropertyWithImages;
  translations: {
    forSale: string;
    forRent: string;
    month: string;
    beds: string;
    baths: string;
  };
}) {
  const primaryImage = property.images[0];
  const imageUrl = primaryImage?.url || "/placeholder-property.jpg";

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full h-64 bg-gray-100">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              property.status === PropertyStatus.FOR_SALE
                ? "bg-spotRed text-white"
                : "bg-spotBeige text-spotDark"
            }`}
          >
            {property.status === PropertyStatus.FOR_SALE ? translations.forSale : translations.forRent}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-spotDark mb-1 group-hover:text-spotRed transition-colors line-clamp-1">
          {property.title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          {property.city}, {property.country}
        </p>

        <p className="text-2xl font-bold text-spotRed mb-3">
          ${property.price.toLocaleString()}
          {property.status === PropertyStatus.FOR_RENT && (
            <span className="text-sm font-normal text-gray-500">{translations.month}</span>
          )}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          {property.bedrooms !== null && (
            <span>{property.bedrooms} {translations.beds}</span>
          )}
          {property.bathrooms !== null && (
            <span>{property.bathrooms} {translations.baths}</span>
          )}
          {property.area !== null && (
            <span>{property.area} m²</span>
          )}
        </div>
      </div>
    </Link>
  );
}
