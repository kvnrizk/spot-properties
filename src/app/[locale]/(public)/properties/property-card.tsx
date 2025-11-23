import { PropertyListItem } from "@/lib/properties";
import { PropertyStatus } from "@prisma/client";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface PropertyCardProps {
  property: PropertyListItem;
  translations: {
    forSale: string;
    forRent: string;
    month: string;
    beds: string;
    baths: string;
  };
}

export function PropertyCard({ property, translations }: PropertyCardProps) {
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
            <span className="text-sm font-normal text-gray-500">/{translations.month}</span>
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
