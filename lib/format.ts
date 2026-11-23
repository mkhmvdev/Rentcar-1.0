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
