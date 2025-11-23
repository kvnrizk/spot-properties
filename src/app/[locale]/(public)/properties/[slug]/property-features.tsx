import { Bed, Bath, Home, Calendar } from "lucide-react";

interface PropertyFeaturesProps {
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  yearBuilt: number | null;
  translations: {
    title: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    yearBuilt: string;
  };
}

export function PropertyFeatures({
  bedrooms,
  bathrooms,
  area,
  yearBuilt,
  translations,
}: PropertyFeaturesProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6">
      <h2 className="text-2xl font-bold text-spot-dark mb-6">{translations.title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {bedrooms !== null && (
          <div className="flex flex-col items-center p-4 bg-spot-beige rounded-lg">
            <Bed className="w-8 h-8 text-spot-red mb-2" />
            <span className="text-2xl font-bold text-spot-dark">{bedrooms}</span>
            <span className="text-sm text-spot-dark/70">{translations.bedrooms}</span>
          </div>
        )}
        {bathrooms !== null && (
          <div className="flex flex-col items-center p-4 bg-spot-beige rounded-lg">
            <Bath className="w-8 h-8 text-spot-red mb-2" />
            <span className="text-2xl font-bold text-spot-dark">{bathrooms}</span>
            <span className="text-sm text-spot-dark/70">{translations.bathrooms}</span>
          </div>
        )}
        {area !== null && (
          <div className="flex flex-col items-center p-4 bg-spot-beige rounded-lg">
            <Home className="w-8 h-8 text-spot-red mb-2" />
            <span className="text-2xl font-bold text-spot-dark">{area}</span>
            <span className="text-sm text-spot-dark/70">{translations.area}</span>
          </div>
        )}
        {yearBuilt !== null && (
          <div className="flex flex-col items-center p-4 bg-spot-beige rounded-lg">
            <Calendar className="w-8 h-8 text-spot-red mb-2" />
            <span className="text-2xl font-bold text-spot-dark">{yearBuilt}</span>
            <span className="text-sm text-spot-dark/70">{translations.yearBuilt}</span>
          </div>
        )}
      </div>
    </div>
  );
}
