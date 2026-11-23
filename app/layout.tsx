import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import Link from "next/link";
import { Phone, Send } from "lucide-react";
import { site, telegramLink } from "@/lib/site";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "cyrillic"], display: "swap" });
const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: ["600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} — avtomobil ijarasi`, template: `%s | ${site.name}` },
  description: "Ijaraga mashina tanlang va bron qiling. Narx va shartlarni telefon orqali kelishamiz.",
  metadataBase: new URL(site.url),
  openGraph: { siteName: site.name, locale: "uz_UZ", type: "website" },
};

export const viewport = { themeColor: "#0b0b0c" };

function Logo() {
  return (
    <Link href="/" transitionTypes={["nav-back"]} className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-tight text-ink">
      <span className="grid size-9 place-items-center rounded-lg bg-brand text-on-brand" aria-hidden>
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor"><path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11h1a1 1 0 011 1v5a1 1 0 01-1 1h-1v1.5a1.5 1.5 0 01-3 0V18H8v1.5a1.5 1.5 0 01-3 0V18H4a1 1 0 01-1-1v-5a1 1 0 011-1zm2.1 0h9.8l-1-3.2a.5.5 0 00-.5-.3H8.6a.5.5 0 00-.5.3zM6.5 15.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm11 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>
      </span>
      {site.name}
    </Link>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const tg = telegramLink();
  return (
    <html lang="uz" className={`${manrope.variable} ${barlow.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
          <div className="container-shell flex h-16 items-center justify-between gap-3">
            <Logo />
            <SiteNav className="max-md:hidden" />
            <div className="flex items-center gap-1.5">
              {tg && (
                <a href={tg} target="_blank" rel="noopener noreferrer" className="grid size-10 place-items-center rounded-lg text-muted transition hover:bg-subtle hover:text-ink" aria-label="Telegramda yozish">
                  <Send size={18} aria-hidden />
                </a>
              )}
              {site.phone && (
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="flex h-10 items-center gap-2 rounded-lg bg-brand px-3.5 text-sm font-bold text-on-brand transition hover:bg-brand-hover"
                >
                  <Phone size={16} aria-hidden />
                  <span className="hidden lg:inline">{site.phone}</span>
                </a>
              )}
            </div>
          </div>
          {/* Telefonda menyu sarlavha ostida, yonga suriladigan qatorda */}
          <div className="border-t border-line md:hidden">
            <SiteNav className="container-shell overflow-x-auto py-1 [scrollbar-width:none]" />
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="mt-20 border-t border-line bg-surface">
          <div className="container-shell flex flex-col gap-2 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-ink">© {new Date().getFullYear()} {site.name}</p>
            <nav className="flex flex-wrap gap-x-5 gap-y-1" aria-label="Pastki menyu">
              <Link href="/biz-haqimizda" className="hover:text-ink">Biz haqimizda</Link>
              <Link href="/mashinalar" className="hover:text-ink">Mashinalar</Link>
              <Link href="/faq" className="hover:text-ink">FAQ</Link>
              <Link href="/profil" className="hover:text-ink">Profil</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
