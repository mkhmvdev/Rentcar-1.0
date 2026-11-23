"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { createBooking, type BookingField, type BookingState } from "@/app/actions";
import { addDays } from "@/lib/format";

const initialState: BookingState = { status: "idle" };

export function BookingForm({ carId, minStartDate }: { carId: number; minStartDate: string }) {
  const [state, formAction, pending] = useActionState(createBooking.bind(null, carId), initialState);
  const values = state.status === "error" ? state.values : {};
  const [startDate, setStartDate] = useState(values.start_date || minStartDate);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl bg-emerald-50 p-6 text-emerald-900 ring-1 ring-emerald-200" role="status">
        <CheckCircle2 size={36} className="text-emerald-600" aria-hidden />
        <h2 className="mt-3 text-xl font-extrabold">Zayavkangiz qabul qilindi!</h2>
        <p className="mt-2">
          Rahmat, {state.customerName}. Tez orada sizga qo&apos;ng&apos;iroq qilib, narx va shartlarni kelishamiz.
        </p>
        <p className="mt-4 text-sm">
          Zayavka raqami: <b className="font-mono">{state.reference}</b>
        </p>
      </div>
    );
  }

  const fieldErrors = state.status === "error" ? state.fieldErrors : {};
  const errorFor = (field: BookingField) =>
    fieldErrors[field] ? <span id={`${field}-error`} className="mt-1 block text-sm font-medium text-red-600">{fieldErrors[field]}</span> : null;
  const inputClass = (field: BookingField) =>
    `mt-1 w-full rounded-lg border px-3 py-3 text-base font-normal outline-none focus:ring-2 focus:ring-brand/30 ${
      fieldErrors[field] ? "border-red-400" : "border-slate-200"
    }`;
  const aria = (field: BookingField) =>
    fieldErrors[field] ? { "aria-invalid": true as const, "aria-describedby": `${field}-error` } : {};

  return (
    <form action={formAction} className="grid gap-4">
      <h2 className="text-xl font-extrabold">Bron qilish</h2>
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{state.message}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold">
          Olish sanasi
          <input
            type="date" name="start_date" required min={minStartDate} value={startDate}
            onChange={(e) => setStartDate(e.target.value)} className={inputClass("start_date")} {...aria("start_date")}
          />
          {errorFor("start_date")}
        </label>
        <label className="text-sm font-semibold">
          Qaytarish sanasi
          <input
            key={startDate}
            type="date" name="end_date" required min={addDays(startDate || minStartDate, 1)}
            defaultValue={values.end_date && values.end_date > startDate ? values.end_date : addDays(startDate || minStartDate, 1)}
            className={inputClass("end_date")} {...aria("end_date")}
          />
          {errorFor("end_date")}
        </label>
      </div>

      <label className="text-sm font-semibold">
        Ismingiz
        <input
          type="text" name="customer_name" required minLength={2} maxLength={100} autoComplete="name"
          defaultValue={values.customer_name} placeholder="Ism Familiya" className={inputClass("customer_name")} {...aria("customer_name")}
        />
        {errorFor("customer_name")}
      </label>

      <label className="text-sm font-semibold">
        Telefon raqamingiz
        <input
          type="tel" name="phone" required autoComplete="tel" inputMode="tel"
          defaultValue={values.phone || "+998 "} placeholder="+998 90 123 45 67" className={inputClass("phone")} {...aria("phone")}
        />
        {errorFor("phone")}
      </label>

      <button
        type="submit" disabled={pending}
        className="mt-1 h-12 rounded-lg bg-brand font-bold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Yuborilmoqda..." : "Zayavka yuborish"}
      </button>
      <p className="text-xs text-slate-500">
        To&apos;lov hozir olinmaydi. Zayavkadan so&apos;ng biz qo&apos;ng&apos;iroq qilib, yakuniy narxni kelishamiz.
      </p>
    </form>
  );
}
