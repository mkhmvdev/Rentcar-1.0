import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { CarFront, Phone } from "lucide-react";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} — avtomobil ijarasi`, template: `%s | ${site.name}` },
  description: "Ijaraga mashina tanlang va bron qiling. Narx va shartlarni telefon orqali kelishamiz.",
  metadataBase: new URL(site.url),
  openGraph: { siteName: site.name, locale: "uz_UZ", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${jakarta.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="container-shell flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-brand">
              <CarFront size={26} aria-hidden />
              {site.name}
            </Link>
            {site.phone && (
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold hover:bg-slate-100"
              >
                <Phone size={16} aria-hidden />
                <span className="hidden sm:inline">{site.phone}</span>
                <span className="sm:hidden">Qo&apos;ng&apos;iroq</span>
              </a>
            )}
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="container-shell flex flex-col gap-2 py-8 text-sm text-slate-500 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} {site.name}</p>
            <p>Narx va ijara shartlari telefon orqali kelishiladi.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
