/**
 * WhatsApp integration utility functions
 * Generates WhatsApp chat links with pre-filled messages
 */

import { cleanBaseUrl } from "@/lib/env";

/**
 * Generates a WhatsApp link with the configured phone number and encoded message
 * @param message - The message to pre-fill in WhatsApp chat
 * @returns Full WhatsApp web URL with encoded message
 */
export function generateWhatsAppLink(message: string): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

  if (!phoneNumber) {
    console.warn('NEXT_PUBLIC_WHATSAPP_NUMBER is not configured');
  }

  // Remove any non-numeric characters from phone number except '+'
  const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message.trim());

  // Generate WhatsApp URL (works on both mobile and desktop)
  return `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
}

/**
 * Generates a default WhatsApp message for general inquiries
 */
export function getDefaultWhatsAppMessage(): string {
  return "Hello, I'm interested in your properties. Can you help me?";
}

/**
 * Generates a property-specific WhatsApp message
 * @param propertyTitle - The title of the property
 * @param propertySlug - The slug of the property for URL generation
 * @param locale - The current locale (defaults to "en" if not provided)
 */
export function getPropertyWhatsAppMessage(propertyTitle: string, propertySlug: string, locale: string = "en"): string {
  // Build locale-aware URL
  const localePath = locale === "en" ? "" : `/${locale}`;
  const propertyUrl = `${cleanBaseUrl}${localePath}/properties/${propertySlug}`;

  return `Hello, I'm interested in the property: ${propertyTitle}.
Link: ${propertyUrl}`;
}

/**
 * Generates a WhatsApp message for admin contacting a lead
 * @param leadName - The name of the lead
 * @param context - Optional context about the inquiry (e.g., property name)
 */
export function getAdminLeadWhatsAppMessage(leadName: string, context?: string): string {
  let message = `Hello ${leadName}, I'm contacting you regarding your inquiry about Spot Properties.`;

  if (context) {
    message += `\n\nYou showed interest in: ${context}`;
  }

  return message;
}

/**
 * Generates a WhatsApp message for admin contacting about an appointment
 * @param appointmentName - The name of the person who booked
 * @param propertyTitle - The property title
 * @param appointmentDate - The appointment date/time
 */
export function getAdminAppointmentWhatsAppMessage(
  appointmentName: string,
  propertyTitle: string,
  appointmentDate: string
): string {
  return `Hello ${appointmentName}, I'm contacting you regarding your appointment for ${propertyTitle} scheduled on ${appointmentDate}.`;
}

/**
 * Opens WhatsApp in a new window/tab
 * @param message - The message to pre-fill
 */
export function openWhatsApp(message: string): void {
  const link = generateWhatsAppLink(message);
  window.open(link, '_blank', 'noopener,noreferrer');
}
