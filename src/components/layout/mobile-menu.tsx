"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Menu, X, Home, Building2, MapPin, Info, Mail, Globe, LogIn } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isRTL = locale === "ar";

  const menuItems = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/properties", label: t("nav.properties"), icon: Building2 },
    { href: "/lebanon", label: t("nav.lebanon"), icon: MapPin },
    { href: "/cyprus", label: t("nav.cyprus"), icon: MapPin },
    { href: "/about", label: t("nav.about"), icon: Info },
    { href: "/contact", label: t("nav.contact"), icon: Mail },
    { href: "/login", label: t("nav.login"), icon: LogIn },
  ];

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-md hover:bg-spot-beige/30 text-spot-dark transition-colors active:scale-95"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[998] lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`
          fixed top-0 h-auto w-[280px] bg-spot-beige z-[999] lg:hidden
          shadow-2xl transition-transform duration-300 ease-in-out
          flex flex-col rounded-b-2xl
          ${isRTL ? "left-0" : "right-0"}
          ${
            isOpen
              ? "translate-x-0"
              : isRTL
                ? "-translate-x-full"
                : "translate-x-full"
          }
        `}
        dir={isRTL ? "rtl" : "ltr"}
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menu")}
      >
        {/* Menu Items */}
        <nav className="flex flex-col px-4 pt-4 pb-6 bg-spot-beige rounded-b-2xl">
          {/* Close Button - Absolute positioned */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-spot-dark hover:text-spot-red transition-colors rounded-md hover:bg-white/50 active:scale-95 z-10"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3.5 mb-1 text-spot-dark hover:bg-white hover:text-spot-red rounded-lg transition-all duration-200 group font-medium"
              >
                <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Language Switcher in Drawer */}
          <div className="pt-4 border-t-2 border-spot-dark/10 mt-2">
            <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-spot-dark/70 uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>{isRTL ? "اللغة" : "Language"}</span>
            </div>
            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
