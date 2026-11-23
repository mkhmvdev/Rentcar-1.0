import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getCars } from "@/lib/api";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection(); // har so'rovda yangi ma'lumot (build paytida backend talab qilinmaydi)
  const cars = await getCars().catch(() => []);
  return [
    { url: site.url, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/mashinalar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/biz-haqimizda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/faq`, changeFrequency: "weekly", priority: 0.5 },
    ...cars.map((car) => ({ url: `${site.url}/cars/${car.id}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
