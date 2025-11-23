import { MetadataRoute } from "next";
import { cleanBaseUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/en/", "/ar/"],
        disallow: ["/admin", "/login", "/api/"],
      },
    ],
    sitemap: `${cleanBaseUrl}/sitemap.xml`,
  };
}
