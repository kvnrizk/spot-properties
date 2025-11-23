import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { isValidLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../locales/${locale}/common.ts`)).default,
  };
});
