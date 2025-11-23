"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errorMessage"));
      }

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Contact Info */}
      <div className="lg:col-span-1 space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-spot-dark mb-6 tracking-tight">
            {t("getInTouch")}
          </h2>
          <p className="text-lg text-spot-dark/80 font-light leading-relaxed">
            {t("getInTouchDescription")}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-spot-red/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-spot-red" />
            </div>
            <div>
              <h3 className="font-semibold text-spot-dark mb-1">{t("phone")}</h3>
              <p className="text-spot-dark/70">{t("phoneValue")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-spot-red/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-spot-red" />
            </div>
            <div>
              <h3 className="font-semibold text-spot-dark mb-1">{t("email")}</h3>
              <p className="text-spot-dark/70">{t("emailValue")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-spot-red/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-spot-red" />
            </div>
            <div>
              <h3 className="font-semibold text-spot-dark mb-1">{t("location")}</h3>
              <p className="text-spot-dark/70">{t("locationValue")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-spot-dark mb-6">{t("sendMessage")}</h3>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-md">
              <p className="text-green-700 font-medium">{t("successMessage")}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-md">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-spot-dark uppercase tracking-wider mb-2"
              >
                {t("nameLabel")} {t("required")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
                placeholder={t("namePlaceholder")}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-spot-dark uppercase tracking-wider mb-2"
              >
                {t("emailLabel")} {t("required")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
                placeholder={t("emailPlaceholder")}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-spot-dark uppercase tracking-wider mb-2"
              >
                {t("phoneLabel")}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors"
                placeholder={t("phonePlaceholder")}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-spot-dark uppercase tracking-wider mb-2"
              >
                {t("messageLabel")} {t("required")}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border-2 border-spot-dark/20 rounded-md text-spot-dark bg-white focus:outline-none focus:border-spot-red transition-colors resize-none"
                placeholder={t("messagePlaceholder")}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-spot-red hover:bg-spot-red/90 text-white font-semibold py-4 px-6 rounded-md transition-all duration-200 flex items-center justify-center gap-2 border-2 border-spot-red hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                t("submitting")
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t("submitButton")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
