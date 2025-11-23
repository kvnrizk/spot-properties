"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;

    // Use the i18n-aware router to switch locales
    // The pathname is already locale-free from usePathname()
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-md border border-spot-dark/20 p-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`
            px-3 py-1 rounded text-sm font-medium transition-all duration-200
            ${
              locale === loc
                ? "bg-spot-red text-white shadow-sm"
                : "text-spot-dark hover:bg-white/50"
            }
          `}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
