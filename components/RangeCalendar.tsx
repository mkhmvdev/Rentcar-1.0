"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { daysBetween, formatDate, MONTH_NAMES } from "@/lib/format";

type Range = { start: string; end: string };

const WEEKDAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

function monthKey(iso: string) {
  return iso.slice(0, 7); // YYYY-MM
}

function shiftMonth(key: string, delta: number) {
  const [y, m] = key.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1 + delta, 1));
  return date.toISOString().slice(0, 7);
}

/** Oy katakchalari: dushanbadan boshlanadi, bo'sh joylar null. */
function monthCells(key: string) {
  const [y, m] = key.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${key}-${String(d).padStart(2, "0")}`);
  return cells;
}

export function RangeCalendar({
  busy,
  minDate,
  maxDate,
  value,
  onChange,
}: {
  busy: Range[];
  minDate: string;
  maxDate: string;
  value: { start: string | null; end: string | null };
  onChange: (value: { start: string | null; end: string | null }) => void;
}) {
  const [view, setView] = useState(monthKey(value.start ?? minDate));
  const [hover, setHover] = useState<string | null>(null);
  const [hint, setHint] = useState("");

  const isBusy = (day: string) => busy.some((r) => day >= r.start && day <= r.end);
  const rangeHitsBusy = (a: string, b: string) => busy.some((r) => r.start <= b && r.end >= a);

  function pick(day: string) {
    setHint("");
    const { start, end } = value;
    if (!start || end) {
      onChange({ start: day, end: null });
      return;
    }
    if (day <= start) {
      onChange({ start: day, end: null });
      return;
    }
    if (rangeHitsBusy(start, day)) {
      setHint("Tanlangan oraliqda band kunlar bor. Boshqa sanani tanlang.");
      onChange({ start: day, end: null });
      return;
    }
    onChange({ start, end: day });
  }

  const previewEnd = value.start && !value.end && hover && hover > value.start && !rangeHitsBusy(value.start, hover) ? hover : null;
  const rangeEnd = value.end ?? previewEnd;
  const canPrev = view > monthKey(minDate);
  const canNext = view < monthKey(maxDate);
  const [year, month] = view.split("-").map(Number);

  return (
    <div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setView(shiftMonth(view, -1))} disabled={!canPrev} className="grid size-9 place-items-center rounded-lg border border-line text-ink transition hover:border-brand disabled:opacity-30" aria-label="Oldingi oy">
          <ChevronLeft size={18} />
        </button>
        <p className="text-sm font-bold capitalize text-ink" aria-live="polite">
          {MONTH_NAMES[month - 1]} {year}
        </p>
        <button type="button" onClick={() => setView(shiftMonth(view, 1))} disabled={!canNext} className="grid size-9 place-items-center rounded-lg border border-line text-ink transition hover:border-brand disabled:opacity-30" aria-label="Keyingi oy">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center" role="grid" onPointerLeave={() => setHover(null)}>
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-2 text-xs font-semibold text-muted">{d}</span>
        ))}
        {monthCells(view).map((day, i) => {
          if (!day) return <span key={`e${i}`} />;
          const busyDay = isBusy(day);
          const disabled = day < minDate || day > maxDate || busyDay;
          const isStart = day === value.start;
          const isEnd = day === rangeEnd;
          const inRange = value.start && rangeEnd && day > value.start && day < rangeEnd;
          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => pick(day)}
              onPointerEnter={() => setHover(day)}
              aria-pressed={isStart || isEnd}
              aria-label={`${formatDate(day)}${busyDay ? ", band" : ""}`}
              className={[
                "relative h-10 text-sm font-semibold transition",
                inRange ? "bg-brand-soft text-brand" : "",
                isStart ? "rounded-l-lg bg-brand text-on-brand" : "",
                isEnd ? "rounded-r-lg bg-brand text-on-brand" : "",
                isStart && !rangeEnd ? "rounded-lg" : "",
                !isStart && !isEnd && !inRange && !disabled ? "rounded-lg text-ink hover:bg-subtle hover:ring-1 hover:ring-brand/40" : "",
                busyDay ? "busy-stripes cursor-not-allowed rounded-md text-bad/70 line-through" : "",
                disabled && !busyDay ? "cursor-not-allowed text-faint" : "",
              ].join(" ")}
            >
              {Number(day.slice(8))}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-brand" /> Tanlangan</span>
        <span className="flex items-center gap-1.5"><span className="busy-stripes size-3 rounded-sm ring-1 ring-bad/30" /> Band (bo&apos;sh mashina yo&apos;q)</span>
      </div>
      {hint && <p className="mt-2 text-sm font-medium text-bad" role="alert">{hint}</p>}
    </div>
  );
}

export function rangeSummary(start: string | null, end: string | null) {
  if (!start) return "Olish kunini tanlang";
  if (!end) return `${formatDate(start)} → qaytarish kunini tanlang`;
  return `${formatDate(start)} → ${formatDate(end)} · ${daysBetween(start, end)} kun`;
}
