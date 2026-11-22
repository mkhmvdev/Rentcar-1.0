import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "MORENT Avtomobil Ijarasi", short_name: "MORENT", description: "Qulay avtomobil ijarasi platformasi", start_url: "/", display: "standalone", background_color: "#F6F7F9", theme_color: "#3563E9", icons: [] };
}
