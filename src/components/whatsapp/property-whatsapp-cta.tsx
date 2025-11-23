'use client';

import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink, getPropertyWhatsAppMessage } from '@/lib/whatsapp';
import { useLocale } from 'next-intl';

interface PropertyWhatsAppCTAProps {
  propertyTitle: string;
  propertySlug: string;
  translations: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
}

/**
 * WhatsApp Call-to-Action section for property detail pages
 * Full-width on mobile, centered on desktop
 */
export function PropertyWhatsAppCTA({ propertyTitle, propertySlug, translations }: PropertyWhatsAppCTAProps) {
  const locale = useLocale();

  const handleClick = () => {
    const message = getPropertyWhatsAppMessage(propertyTitle, propertySlug, locale);
    const link = generateWhatsAppLink(message);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#ecddc9] rounded-lg p-8 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold text-spot-dark mb-2">
            {translations.title}
          </h3>
          <p className="text-spot-dark/80 text-sm md:text-base">
            {translations.subtitle}
          </p>
        </div>
        <button
          onClick={handleClick}
          className="w-full md:w-auto bg-spot-dark hover:bg-spot-dark/90 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 border-2 border-spot-dark"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-lg">{translations.buttonText}</span>
        </button>
      </div>
    </div>
  );
}
