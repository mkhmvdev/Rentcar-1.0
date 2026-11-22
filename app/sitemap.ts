import type { MetadataRoute } from "next";
import { cars } from "@/data/cars";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://morent.uz";
  const staticRoutes = ["", "/vehicles", "/about", "/contact", "/booking", "/profile", "/login"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.8 })),
    ...cars.map((car) => ({ url: `${base}/vehicles/${car.id}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 })),
  ];
}
