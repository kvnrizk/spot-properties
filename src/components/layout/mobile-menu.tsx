"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Menu, X, Home, Building2, MapPin, Info, Mail } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export function MobileMenu() {
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
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 text-spot-dark hover:text-spot-red transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`
          fixed top-0 bottom-0 w-[280px] bg-spot-beige z-50 lg:hidden
          shadow-2xl transition-transform duration-300 ease-in-out
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
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-spot-dark/10">
          <h2 className="text-lg font-bold text-spot-dark">
            {t("nav.menu")}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-spot-dark hover:text-spot-red transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-spot-dark hover:bg-white/50 hover:text-spot-red rounded-lg transition-all duration-200 group"
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-spot-dark/10 bg-white/30">
          <p className="text-xs text-spot-dark/60 text-center">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </>
  );
}
