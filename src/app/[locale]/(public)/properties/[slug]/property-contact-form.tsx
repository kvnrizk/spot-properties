"use client";

import { useState } from "react";
import { Send, Calendar, MessageCircle } from "lucide-react";
import { generateWhatsAppLink, getPropertyWhatsAppMessage } from "@/lib/whatsapp";
import { useLocale } from "next-intl";

interface PropertyContactFormProps {
  propertyId: string;
  propertyTitle: string;
  propertySlug: string;
  translations: {
    interestedTitle: string;
    contactTab: string;
    bookVisitTab: string;
    chatWhatsApp: string;
    name: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    message: string;
    messagePlaceholder: string;
    preferredDateTime: string;
    anyRequests: string;
    sendMessage: string;
    sending: string;
    bookVisit: string;
    booking: string;
    contactSuccess: string;
    appointmentSuccess: string;
    required: string;
  };
}

export default function PropertyContactForm({ propertyId, propertyTitle, propertySlug, translations }: PropertyContactFormProps) {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"contact" | "appointment">("contact");
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [appointmentData, setAppointmentData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactData,
          propertyId,
        }),
      });

      // Check if response has content before parsing JSON
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        // Show detailed validation errors if available
        if (data.details) {
          const errorMessages = Object.values(data.details).join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.error || "Failed to submit form");
      }

      setSuccess(true);
      setContactData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...appointmentData,
          propertyId,
        }),
      });

      // Check if response has content before parsing JSON
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        // Show detailed validation errors if available
        if (data.details) {
          const errorMessages = Object.values(data.details).join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.error || "Failed to submit form");
      }

      setSuccess(true);
      setAppointmentData({ name: "", email: "", phone: "", date: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6 shadow-lg sticky top-6">
      <h3 className="text-2xl font-bold text-spot-dark mb-6">{translations.interestedTitle}</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("contact")}
          className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
            activeTab === "contact"
              ? "bg-spot-red text-white"
              : "bg-[#ecddc9] text-spot-dark hover:bg-[#ecddc9]/80"
          }`}
        >
          {translations.contactTab}
        </button>
        <button
          onClick={() => setActiveTab("appointment")}
          className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
            activeTab === "appointment"
              ? "bg-spot-red text-white"
              : "bg-[#ecddc9] text-spot-dark hover:bg-[#ecddc9]/80"
          }`}
        >
          {translations.bookVisitTab}
        </button>
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={() => {
          const message = getPropertyWhatsAppMessage(propertyTitle, propertySlug, locale);
          const link = generateWhatsAppLink(message);
          window.open(link, '_blank', 'noopener,noreferrer');
        }}
        className="w-full mb-6 bg-spot-dark hover:bg-spot-dark/90 text-white font-semibold py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center gap-2 border-2 border-spot-dark hover:shadow-lg"
      >
        <MessageCircle className="w-5 h-5" />
        {translations.chatWhatsApp}
      </button>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border-2 border-green-500 rounded-md">
          <p className="text-green-700 text-sm font-medium">
            {activeTab === "contact"
              ? translations.contactSuccess
              : translations.appointmentSuccess}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded-md">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Contact Form */}
      {activeTab === "contact" && (
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
              {translations.name} {translations.required}
            </label>
            <input
              type="text"
              value={contactData.name}
              onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
              placeholder={translations.namePlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
              Email {translations.required}
            </label>
            <input
              type="email"
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
              placeholder={translations.emailPlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
              {translations.phone}
            </label>
            <input
              type="tel"
              value={contactData.phone}
              onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
              placeholder={translations.phonePlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
              {translations.message} {translations.required}
            </label>
            <textarea
              value={contactData.message}
              onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors resize-none"
              placeholder={`${translations.messagePlaceholder.replace("this property", propertyTitle)}`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-spot-red hover:bg-spot-red/90 text-white font-semibold py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center gap-2 border-2 border-spot-red hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              translations.sending
            ) : (
              <>
                <Send className="w-5 h-5" />
                {translations.sendMessage}
              </>
            )}
          </button>
        </form>
      )}

      {/* Appointment Form */}
      {activeTab === "appointment" && (
        <form onSubmit={handleAppointmentSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
              {translations.name} {translations.required}
            </label>
            <input
              type="text"
              value={appointmentData.name}
              onChange={(e) => setAppointmentData({ ...appointmentData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
              placeholder={translations.namePlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
              Email {translations.required}
            </label>
            <input
              type="email"
              value={appointmentData.email}
              onChange={(e) => setAppointmentData({ ...appointmentData, email: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
              placeholder={translations.emailPlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
              {translations.phone}
            </label>
            <input
              type="tel"
              value={appointmentData.phone}
              onChange={(e) => setAppointmentData({ ...appointmentData, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
              placeholder={translations.phonePlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
              {translations.preferredDateTime} {translations.required}
            </label>
            <input
              type="datetime-local"
              value={appointmentData.date}
              onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-spot-dark uppercase tracking-wider mb-2">
              {translations.message}
            </label>
            <textarea
              value={appointmentData.message}
              onChange={(e) => setAppointmentData({ ...appointmentData, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors resize-none"
              placeholder={translations.anyRequests}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-spot-red hover:bg-spot-red/90 text-white font-semibold py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center gap-2 border-2 border-spot-red hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              translations.booking
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                {translations.bookVisit}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
