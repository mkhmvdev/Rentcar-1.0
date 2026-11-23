"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { getSavedRequests, REQUESTS_EVENT } from "@/lib/booking-status";

const LINKS = [
  { href: "/biz-haqimizda", label: "Biz haqimizda" },
  { href: "/mashinalar", label: "Mashinalar" },
  { href: "/faq", label: "FAQ" },
  { href: "/profil", label: "Profil" },
] as const;

function subscribe(callback: () => void) {
  window.addEventListener(REQUESTS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(REQUESTS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Sarlavhadagi menyu. Profil yonida shu qurilmadan yuborilgan zayavkalar soni chiqadi. */
export function SiteNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const requests = useSyncExternalStore(subscribe, () => getSavedRequests().length, () => 0);

  return (
    <nav className={`flex items-center gap-1 ${className}`} aria-label="Asosiy menyu">
      {LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`) || (href === "/mashinalar" && pathname.startsWith("/cars/")) || (href === "/profil" && pathname.startsWith("/zayavka"));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition ${
              active ? "text-brand" : "text-muted hover:bg-subtle hover:text-ink"
            }`}
          >
            {label}
            {href === "/profil" && requests > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-bold leading-5 text-on-brand">{requests}</span>
            )}
            {active && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand max-md:hidden" aria-hidden />}
          </Link>
        );
      })}
    </nav>
  );
}
