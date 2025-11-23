'use client';

import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink, getAdminAppointmentWhatsAppMessage } from '@/lib/whatsapp';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AppointmentActionsProps {
  appointmentName: string;
  appointmentPhone?: string | null;
  propertyTitle: string;
  appointmentDate: string;
}

export function AppointmentActions({
  appointmentName,
  appointmentPhone,
  propertyTitle,
  appointmentDate,
}: AppointmentActionsProps) {
  const handleWhatsAppClick = () => {
    if (!appointmentPhone) {
      toast.error('No phone number available for this appointment');
      return;
    }

    const message = getAdminAppointmentWhatsAppMessage(
      appointmentName,
      propertyTitle,
      appointmentDate
    );
    const link = generateWhatsAppLink(message);
    window.open(link, '_blank', 'noopener,noreferrer');
    toast.success('Opening WhatsApp...');
  };

  return (
    <div className="flex items-center gap-2">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        disabled={!appointmentPhone}
        className="p-2 rounded-md bg-[#25D366] text-white hover:bg-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300"
        title={appointmentPhone ? 'Contact via WhatsApp' : 'No phone number available'}
      >
        <MessageCircle className="w-4 h-4" />
      </button>

      {/* Manage Button */}
      <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
        Manage
      </Button>
    </div>
  );
}
