"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { createBooking, type BookingField, type BookingState } from "@/app/actions";
import { saveRequest } from "@/lib/booking-status";
import { maskPhone } from "@/lib/format";
import { RangeCalendar, rangeSummary } from "@/components/RangeCalendar";
import { StatusTracker } from "@/components/StatusTracker";

const initialState: BookingState = { status: "idle" };

export function BookingForm({
  carId,
  busy,
  minDate,
  maxDate,
  telegramHref,
}: {
  carId: number;
  busy: { start: string; end: string }[];
  minDate: string;
  maxDate: string;
  telegramHref: string | null;
}) {
  const [state, formAction, pending] = useActionState(createBooking.bind(null, carId), initialState);
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [phone, setPhone] = useState("+998 ");

  useEffect(() => {
    if (state.status === "success") saveRequest(state.reference);
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="grid gap-4">
        <h2 className="text-lg font-bold">Zayavka yuborildi</h2>
        <StatusTracker
          initial={{
            reference: state.reference,
            car_id: carId,
            car_name: state.carName,
            start_date: state.startDate,
            end_date: state.endDate,
            status: "new",
          }}
        />
        <p className="text-sm text-muted">
          Holatni keyinroq ham{" "}
          <Link href={`/zayavka/${state.reference}`} className="font-semibold text-brand hover:underline">shu havola</Link>{" "}
          yoki menyudagi &laquo;Profil&raquo; sahifasida ko&apos;rishingiz mumkin.
        </p>
      </div>
    );
  }

  const fieldErrors = state.status === "error" ? state.fieldErrors : {};
  const values = state.status === "error" ? state.values : {};
  const dateError = fieldErrors.start_date ?? fieldErrors.end_date;
  const errorText = (field: BookingField) =>
    fieldErrors[field] ? <span id={`${field}-error`} className="mt-1.5 block text-sm font-medium text-bad">{fieldErrors[field]}</span> : null;
  const inputClass = (field: BookingField) =>
    `mt-1.5 h-12 w-full rounded-lg border bg-surface px-3.5 text-base text-ink outline-none transition placeholder:text-faint focus:border-brand focus:ring-3 focus:ring-brand/15 ${
      fieldErrors[field] ? "border-bad" : "border-line"
    }`;
  const ready = Boolean(range.start && range.end);

  return (
    <form action={formAction} className="grid gap-6">
      <input type="hidden" name="start_date" value={range.start ?? ""} />
      <input type="hidden" name="end_date" value={range.end ?? ""} />

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold">Bron qilish</h2>
          <span className="text-xs font-medium text-muted">1-qadam: sana</span>
        </div>
        <div className="mt-3 rounded-xl border border-line p-4">
          <RangeCalendar busy={busy} minDate={minDate} maxDate={maxDate} value={range} onChange={setRange} />
        </div>
        <p className={`mt-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold ${ready ? "bg-brand-soft text-brand" : "bg-subtle text-muted"}`} aria-live="polite">
          {rangeSummary(range.start, range.end)}
        </p>
        {dateError && <p id="start_date-error" className="mt-1.5 text-sm font-medium text-bad">{dateError}</p>}
      </div>

      <div className="grid gap-4">
        <span className="text-xs font-medium text-muted">2-qadam: aloqa ma&apos;lumotlari</span>
        {state.status === "error" && state.message && (
          <p role="alert" className="rounded-lg bg-bad-soft p-3 text-sm font-semibold text-bad ring-1 ring-bad/20">{state.message}</p>
        )}
        <label className="text-sm font-semibold">
          Ismingiz
          <input
            type="text" name="customer_name" required minLength={2} maxLength={100} autoComplete="name"
            defaultValue={values.customer_name} placeholder="Ism Familiya" className={inputClass("customer_name")}
            aria-invalid={Boolean(fieldErrors.customer_name)} aria-describedby={fieldErrors.customer_name ? "customer_name-error" : undefined}
          />
          {errorText("customer_name")}
        </label>
        <label className="text-sm font-semibold">
          Telefon raqamingiz
          <input
            type="tel" name="phone" required autoComplete="tel" inputMode="tel"
            value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))}
            placeholder="+998 90 123 45 67" className={`${inputClass("phone")} tabular-nums tracking-wide`}
            aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
          />
          {errorText("phone")}
        </label>
      </div>

      <div className="grid gap-3">
        <button
          type="submit"
          disabled={pending || !ready}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-brand font-bold text-on-brand transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-subtle disabled:text-faint"
        >
          {pending ? "Yuborilmoqda..." : ready ? "Zayavka yuborish" : "Avval sanani tanlang"}
        </button>
        {telegramHref && (
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-line text-sm font-semibold text-ink transition hover:border-[#229ed9] hover:text-[#229ed9]"
          >
            <Send size={16} aria-hidden /> Telegramda so&apos;rash
          </a>
        )}
        <p className="text-center text-xs text-muted">To&apos;lov hozir olinmaydi. Yakuniy narx telefonda kelishiladi.</p>
      </div>
    </form>
  );
}
