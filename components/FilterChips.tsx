import Link from "next/link";
import type { Option } from "@/lib/api";

export type Filters = { type?: string; transmission?: string; sort?: string };

function hrefWith(current: Filters, key: keyof Filters, value?: string) {
  const params = new URLSearchParams();
  const merged = { ...current, [key]: value };
  for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
  return params.size ? `/mashinalar?${params}` : "/mashinalar";
}

function ChipRow({ label, field, options, current }: { label: string; field: keyof Filters; options: Option[]; current: Filters }) {
  const active = current[field];
  const chips = [{ value: "", label: "Hammasi" }, ...options];
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs font-semibold text-muted">{label}</span>
      <div className="-my-1 flex gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]">
        {chips.map((chip) => {
          const isActive = (active ?? "") === chip.value;
          return (
            <Link
              key={chip.value || "all"}
              href={hrefWith(current, field, chip.value || undefined)}
              replace
              scroll={false}
              aria-current={isActive ? "true" : undefined}
              className={`shrink-0 rounded-lg border px-3.5 py-1.5 text-sm font-medium transition ${
                isActive ? "border-brand bg-brand text-on-brand" : "border-line bg-surface text-ink hover:border-brand/60"
              }`}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function FilterChips({ current, carTypes, transmissions }: { current: Filters; carTypes: Option[]; transmissions: Option[] }) {
  return (
    <div className="grid gap-2.5 rounded-xl border border-line bg-surface p-4">
      <ChipRow label="Turi" field="type" options={carTypes} current={current} />
      <ChipRow label="Uzatmalar qutisi" field="transmission" options={transmissions} current={current} />
      <ChipRow
        label="Narx"
        field="sort"
        options={[{ value: "price", label: "Arzonidan" }, { value: "-price", label: "Qimmatidan" }]}
        current={current}
      />
    </div>
  );
}
