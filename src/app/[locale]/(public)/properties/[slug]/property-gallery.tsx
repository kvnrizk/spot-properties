"use client";

import { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: Array<{
    id: string;
    url: string;
  }>;
  propertyTitle: string;
  galleryTitle: string;
}

export function PropertyGallery({ images, propertyTitle, galleryTitle }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6">
        <h2 className="text-2xl font-bold text-spot-dark mb-4">{galleryTitle}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image.url)}
              className="relative h-48 rounded-lg overflow-hidden border-2 border-spot-dark/20 hover:border-spot-red transition-colors cursor-pointer"
            >
              <Image
                src={image.url}
                alt={propertyTitle}
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-spot-red transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt={propertyTitle}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
