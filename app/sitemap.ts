import type { MetadataRoute } from "next";
import { getCars } from "@/lib/api";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await getCars().catch(() => []);
  return [
    { url: site.url, changeFrequency: "daily", priority: 1 },
    ...cars.map((car) => ({ url: `${site.url}/cars/${car.id}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
