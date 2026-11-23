import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  // Sayt, admin panel va rasmlar bitta manzildan ochiladi (masalan, http://localhost:3000).
  // Next.js quyidagi yo'llarni ichkarida Django'ga uzatadi; brauzer Django portini ko'rmaydi.
  async rewrites() {
    return [
      // `(.*)` — yo'lni oxiridagi "/" bilan birga uzatadi (Django /admin/login/ va /admin/login ni farqlaydi).
      { source: "/admin", destination: `${backendUrl}/admin/` },
      { source: "/admin/:path(.*)", destination: `${backendUrl}/admin/:path` },
      { source: "/static/:path(.*)", destination: `${backendUrl}/static/:path` },
      { source: "/media/:path(.*)", destination: `${backendUrl}/media/:path` },
    ];
  },
  // Django manzillari "/" bilan tugaydi (/admin/cars/car/); Next ularni olib tashlamasligi kerak.
  skipTrailingSlashRedirect: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
