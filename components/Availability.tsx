import { formatDate } from "@/lib/format";

/** "Mavjud · 2 ta qoldi" yoki "Mavjud emas · 28-noyabrda bo'shaydi". */
export function Availability({
  count,
  nextFree,
  size = "sm",
}: {
  count: number;
  nextFree: string | null;
  size?: "sm" | "md";
}) {
  const available = count > 0;
  const pad = size === "md" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold ring-1 ${pad} ${
        available ? "bg-ok-soft text-ok ring-ok/20" : "bg-bad-soft text-bad ring-bad/20"
      }`}
    >
      <span className={`size-1.5 rounded-full ${available ? "bg-ok" : "bg-bad"}`} aria-hidden />
      {available ? (
        <>
          Mavjud <span className="font-normal opacity-50">·</span> {count} ta qoldi
        </>
      ) : (
        <>
          Mavjud emas
          {nextFree && (
            <>
              <span className="font-normal opacity-50">·</span>
              <span className="font-medium">{formatDate(addOne(nextFree))}dan bo&apos;sh</span>
            </>
          )}
        </>
      )}
    </span>
  );
}

function addOne(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
