export type BookingStatus = "new" | "confirmed" | "rejected" | "returned";

export const STATUS_INFO: Record<BookingStatus, { title: string; text: string; tone: "warn" | "ok" | "bad" | "info" }> = {
  new: {
    title: "Ko'rib chiqilmoqda",
    text: "Zayavkangiz qabul qilindi. Administrator tez orada qo'ng'iroq qilib, narx va shartlarni kelishadi.",
    tone: "warn",
  },
  confirmed: {
    title: "Tasdiqlandi",
    text: "Mashina siz uchun band qilindi. Kelishilgan vaqtda olib ketishingiz mumkin.",
    tone: "ok",
  },
  rejected: {
    title: "Sizning so'rovingiz rad etildi",
    text: "Afsuski, bu zayavka bo'yicha ijara amalga oshmadi. Boshqa sana yoki mashinani tanlab ko'ring.",
    tone: "bad",
  },
  returned: {
    title: "Ijara yakunlandi",
    text: "Mashina qaytarildi. Bizni tanlaganingiz uchun rahmat!",
    tone: "info",
  },
};

export const TONE_CLASSES = {
  warn: { box: "bg-warn-soft ring-warn/25", text: "text-warn", dot: "bg-warn pulse-dot" },
  ok: { box: "bg-ok-soft ring-ok/25", text: "text-ok", dot: "bg-ok" },
  bad: { box: "bg-bad-soft ring-bad/25", text: "text-bad", dot: "bg-bad" },
  info: { box: "bg-brand-soft ring-brand/20", text: "text-brand", dot: "bg-brand" },
} as const;

/* ---------- Zayavka raqamlarini shu qurilmada eslab qolish ---------- */
const STORAGE_KEY = "rentcar-requests";
export const REQUESTS_EVENT = "rentcar-requests-changed";

export function getSavedRequests(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function saveRequest(reference: string) {
  try {
    const list = [reference, ...getSavedRequests().filter((r) => r !== reference)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(REQUESTS_EVENT));
  } catch {
    // Saqlab bo'lmasa (yopiq rejim) — zayavka raqami ekranda baribir ko'rsatiladi.
  }
}

export function forgetRequest(reference: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getSavedRequests().filter((r) => r !== reference)));
    window.dispatchEvent(new Event(REQUESTS_EVENT));
  } catch {
    // e'tiborsiz qoldiriladi
  }
}
