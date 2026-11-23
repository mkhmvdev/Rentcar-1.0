"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { forgetRequest, getSavedRequests } from "@/lib/booking-status";
import { StatusTracker, type TrackedBooking } from "@/components/StatusTracker";

type Loaded = { reference: string; booking: TrackedBooking | null };

export function MyRequests() {
  const [items, setItems] = useState<Loaded[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const references = getSavedRequests();
    Promise.all(
      references.map(async (reference): Promise<Loaded> => {
        try {
          const response = await fetch(`/api/bookings/${reference}`, { cache: "no-store" });
          if (response.status === 404) {
            forgetRequest(reference);
            return { reference, booking: null };
          }
          if (!response.ok) throw new Error();
          return { reference, booking: (await response.json()) as TrackedBooking };
        } catch {
          return { reference, booking: { reference, status: "new" } };
        }
      }),
    ).then((loaded) => {
      if (!cancelled) setItems(loaded.filter((item) => item.booking));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (items === null) {
    return <div className="h-40 animate-pulse rounded-xl bg-surface ring-1 ring-line" aria-busy="true" aria-label="Yuklanmoqda" />;
  }
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-bold">Bu qurilmadan zayavka yuborilmagan</p>
        <Link href="/mashinalar" className="mt-4 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-bold text-on-brand hover:bg-brand-hover">
          Mashina tanlash
        </Link>
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {items.map(({ reference, booking }) => (
        <StatusTracker key={reference} initial={booking!} compact />
      ))}
    </div>
  );
}
