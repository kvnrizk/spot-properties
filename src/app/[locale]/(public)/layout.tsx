"use client";

import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { SessionProvider } from "@/components/providers/session-provider";
import { FloatingWhatsAppButton } from "@/components/whatsapp/floating-whatsapp-button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-menu";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useTranslations, useLocale } from "next-intl";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <SessionProvider>
      <div className="min-h-screen bg-spot-beige text-spot-dark">
        {/* Mobile Header with Hide-on-Scroll */}
        <MobileHeader>
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo - Always visible */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0" dir="ltr">
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-bold text-spot-red flex items-center">
                  Sp<MapPin className="w-4 h-4 sm:w-5 sm:h-5 mx-0.5 fill-spot-red" />t
                </span>
                <span className="text-lg sm:text-xl font-bold text-spot-dark">
                  Properties
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/properties"
                className="text-sm font-medium hover:text-spot-red transition-colors"
              >
                {t("nav.properties")}
              </Link>
              <Link
                href="/lebanon"
                className="text-sm font-medium hover:text-spot-red transition-colors"
              >
                {t("nav.lebanon")}
              </Link>
              <Link
                href="/cyprus"
                className="text-sm font-medium hover:text-spot-red transition-colors"
              >
                {t("nav.cyprus")}
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-spot-red transition-colors"
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-spot-red transition-colors"
              >
                {t("nav.contact")}
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* Mobile Navigation - Hamburger + Drawer */}
              <MobileNav />
            </div>
          </nav>
        </MobileHeader>

        {/* Main Content with Top Padding for Fixed Header */}
        <main className="pt-16">{children}</main>

        <footer className="bg-spot-dark text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-1" dir="ltr">
                  <span className="text-2xl font-bold text-spot-red flex items-center">
                    Sp<MapPin className="w-5 h-5 mx-0.5 fill-spot-red" />t
                  </span>
                  <span className="text-xl font-bold text-white">
                    Properties
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  {t("footer.tagline")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t("footer.quickLinks")}</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/properties" className="hover:text-white">
                      {t("nav.properties")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-white">
                      {t("footer.aboutUs")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white">
                      {t("nav.contact")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t("footer.locations")}</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/lebanon" className="hover:text-white">
                      {t("nav.lebanon")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/cyprus" className="hover:text-white">
                      {t("nav.cyprus")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t("footer.contactSection")}</h3>
                <p className="text-sm text-gray-400">
                  {t("footer.email")}
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
              <p>{t("footer.copyright")}</p>
            </div>
          </div>
        </footer>

        <FloatingWhatsAppButton />
      </div>
    </SessionProvider>
  );
}
