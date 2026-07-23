import type { MetadataRoute } from "next";

const BASE_URL = "https://iniyazhl.shop";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/account", "/checkout", "/cart"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
