import Image from "next/image";
import { MapPin } from "lucide-react";

interface PropertyHeaderProps {
  title: string;
  status: string;
  imageUrl?: string;
  city: string;
  region: string | null;
  country: string;
}

export function PropertyHeader({
  title,
  status,
  imageUrl,
  city,
  region,
  country,
}: PropertyHeaderProps) {
  const statusDisplay = status.replace("_", " ");

  return (
    <section className="relative h-[60vh] bg-spot-dark">
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-spot-dark/50 via-transparent to-spot-dark/70" />
        </>
      )}

      {/* Title Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-spot-dark to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block mb-4">
            <span className="bg-spot-red text-white text-xs font-bold px-4 py-2 rounded-md uppercase tracking-wider">
              {statusDisplay}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-5 h-5 text-spot-red" />
            <span className="text-lg">
              {region ? `${region}, ` : ""}{city}, {country}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
