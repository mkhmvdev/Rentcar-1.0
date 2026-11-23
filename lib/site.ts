export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Rent Car",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Sarlavhada ko'rinadigan aloqa raqami, masalan "+998 90 123 45 67". Bo'sh bo'lsa ko'rsatilmaydi. */
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
};
