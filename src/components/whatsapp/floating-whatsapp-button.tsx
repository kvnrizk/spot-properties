'use client';

import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink, getDefaultWhatsAppMessage } from '@/lib/whatsapp';

/**
 * Floating WhatsApp contact button
 * Appears on all public pages in the bottom-right corner
 */
export function FloatingWhatsAppButton() {
  const handleClick = () => {
    const message = getDefaultWhatsAppMessage();
    const link = generateWhatsAppLink(message);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-spot-red shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-spot-red focus:ring-offset-2"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </button>
  );
}
