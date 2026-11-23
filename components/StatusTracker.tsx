"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Flag, XCircle } from "lucide-react";
import { formatDate } from "@/lib/format";
import { STATUS_INFO, TONE_CLASSES, type BookingStatus } from "@/lib/booking-status";

export type TrackedBooking = {
  reference: string;
  car_id?: number;
  car_name?: string;
  start_date?: string;
  end_date?: string;
  status: BookingStatus;
};

const ICONS = { new: Clock3, confirmed: CheckCircle2, rejected: XCircle, returned: Flag } as const;
/** Holatga qarab qanchalik tez-tez tekshiriladi (ms). null — tekshirish to'xtaydi. */
const POLL_MS: Record<BookingStatus, number | null> = { new: 5000, confirmed: 30000, rejected: null, returned: null };

/** Zayavka holatini ko'rsatadi va admin Telegramda tugma bosganda o'zi yangilanadi. */
export function StatusTracker({ initial, compact = false }: { initial: TrackedBooking; compact?: boolean }) {
  const [booking, setBooking] = useState(initial);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const delay = POLL_MS[booking.status];
    if (delay === null) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/bookings/${booking.reference}`, { cache: "no-store" });
        if (!response.ok) throw new Error(String(response.status));
        const data = (await response.json()) as TrackedBooking;
        if (!cancelled) {
          setOffline(false);
          // Holat o'zgarmasa ham yangi obyekt beramiz — keyingi tekshiruv rejalashtiriladi.
          setBooking((prev) => ({ ...prev, ...data }));
        }
      } catch {
        if (!cancelled) {
          setOffline(true);
          setBooking((prev) => ({ ...prev }));
        }
      }
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [booking]);

  const info = STATUS_INFO[booking.status];
  const tone = TONE_CLASSES[info.tone];
  const Icon = ICONS[booking.status];

  return (
    <div className={`rounded-xl p-5 ring-1 ${tone.box}`} role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <Icon size={compact ? 22 : 28} className={`mt-0.5 shrink-0 ${tone.text}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className={`flex items-center gap-2 font-bold ${compact ? "text-base" : "text-lg"} ${tone.text}`}>
            {info.title}
            {booking.status === "new" && <span className={`size-2 rounded-full ${tone.dot}`} aria-hidden />}
          </p>
          <p className="mt-1 text-sm text-ink/80">{info.text}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-ink/10 pt-4 text-sm">
        <div>
          <dt className="text-xs text-muted">Zayavka raqami</dt>
          <dd className="mt-0.5 font-plate text-xl font-bold tracking-wider text-ink">{booking.reference}</dd>
        </div>
        {booking.start_date && booking.end_date && (
          <div>
            <dt className="text-xs text-muted">Sanalar</dt>
            <dd className="mt-0.5 font-semibold text-ink">{formatDate(booking.start_date)} — {formatDate(booking.end_date)}</dd>
          </div>
        )}
        {booking.car_name && (
          <div className="col-span-2">
            <dt className="text-xs text-muted">Mashina</dt>
            <dd className="mt-0.5 font-semibold text-ink">
              {booking.car_id ? <Link href={`/cars/${booking.car_id}`} className="hover:text-brand">{booking.car_name}</Link> : booking.car_name}
            </dd>
          </div>
        )}
      </dl>

      {booking.status === "new" && (
        <p className="mt-3 text-xs text-muted">
          {offline ? "Server bilan aloqa yo'q, qayta urinilmoqda…" : "Holat avtomatik yangilanadi — sahifani yangilash shart emas."}
        </p>
      )}
    </div>
  );
}
