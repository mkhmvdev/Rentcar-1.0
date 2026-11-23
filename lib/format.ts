const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

/** 450000 -> "450 000 so'm" */
export function formatPrice(amount: number) {
  return `${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'm`;
}

/** "2026-11-28" -> "28-noyabr" */
export function formatDate(isoDate: string) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${day}-${MONTHS[month - 1]}`;
}

/** "2026-11-28" -> "28-NOY" */
export function formatDateShort(isoDate: string) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${day}-${MONTHS[month - 1].slice(0, 3).toUpperCase()}`;
}

/** Ikki sana orasidagi kunlar soni. */
export function daysBetween(start: string, end: string) {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000);
}

export const MONTH_NAMES = MONTHS;

/** Toshkent vaqti bo'yicha bugungi sana, YYYY-MM-DD. */
export function todayInTashkent() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(new Date());
}

/** YYYY-MM-DD sanaga kun qo'shadi. */
export function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Raqamlarni "+998 90 123 45 67" ko'rinishiga keltiradi (yozish davomida). */
export function maskPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  digits = digits.slice(0, 9);
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean);
  return `+998${parts.length ? " " + parts.join(" ") : ""}`;
}
