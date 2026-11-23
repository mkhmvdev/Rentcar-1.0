"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Option } from "@/lib/api";

type Filters = { type?: string; transmission?: string; sort?: string };

export function CarFilters({ current, carTypes, transmissions }: { current: Filters; carTypes: Option[]; transmissions: Option[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function update(key: keyof Filters, value: string) {
    const next = new URLSearchParams();
    const merged = { ...current, [key]: value };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    startTransition(() => router.replace(next.size ? `/?${next}#mashinalar` : "/#mashinalar", { scroll: false }));
  }

  const selectClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm";
  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${pending ? "opacity-60" : ""}`} aria-busy={pending}>
      <label className="text-sm font-semibold text-slate-600">
        Turi
        <select className={`mt-1 ${selectClass}`} value={current.type ?? ""} onChange={(e) => update("type", e.target.value)}>
          <option value="">Hammasi</option>
          {carTypes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-600">
        Uzatmalar qutisi
        <select className={`mt-1 ${selectClass}`} value={current.transmission ?? ""} onChange={(e) => update("transmission", e.target.value)}>
          <option value="">Hammasi</option>
          {transmissions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-600">
        Saralash
        <select className={`mt-1 ${selectClass}`} value={current.sort ?? ""} onChange={(e) => update("sort", e.target.value)}>
          <option value="">Tavsiya etilgan</option>
          <option value="price">Avval arzonlari</option>
          <option value="-price">Avval qimmatlari</option>
        </select>
      </label>
    </div>
  );
}
