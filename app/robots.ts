import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/profile", "/booking/success"] }], sitemap: "https://morent.uz/sitemap.xml" };
}
