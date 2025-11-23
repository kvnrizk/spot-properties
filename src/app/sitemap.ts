import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { cleanBaseUrl } from "@/lib/env";

const locales = ["en", "ar"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Static pages for both locales
  const staticPages: MetadataRoute.Sitemap = [];

  // Add home pages
  locales.forEach((locale) => {
    staticPages.push({
      url: `${cleanBaseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    });
  });

  // Add properties index pages
  locales.forEach((locale) => {
    staticPages.push({
      url: `${cleanBaseUrl}/${locale}/properties`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    });
  });

  // Add country pages
  const countries = ["lebanon", "cyprus"];
  locales.forEach((locale) => {
    countries.forEach((country) => {
      staticPages.push({
        url: `${cleanBaseUrl}/${locale}/${country}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  // Add about and contact pages
  const otherPages = ["about", "contact"];
  locales.forEach((locale) => {
    otherPages.forEach((page) => {
      staticPages.push({
        url: `${cleanBaseUrl}/${locale}/${page}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  });

  // Fetch all published properties
  const properties = await db.property.findMany({
    where: {
      isPublished: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Add property detail pages for both locales
  const propertyPages: MetadataRoute.Sitemap = [];
  properties.forEach((property) => {
    locales.forEach((locale) => {
      propertyPages.push({
        url: `${cleanBaseUrl}/${locale}/properties/${property.slug}`,
        lastModified: property.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  });

  return [...staticPages, ...propertyPages];
}
