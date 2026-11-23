import "server-only";
import { unstable_rethrow } from "next/navigation";

export const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export type CarType = "sedan" | "suv" | "hatchback" | "minivan" | "pickup" | "sport";
export type Transmission = "automatic" | "manual";

export type Car = {
  id: number;
  name: string;
  brand: string;
  car_type: CarType;
  car_type_label: string;
  year: number;
  price_per_day: number;
  seats: number;
  transmission: Transmission;
  transmission_label: string;
  fuel_type: string;
  fuel_type_label: string;
  image: string | null;
  /** "01 A 123 BC" yoki bo'sh satr */
  plate_number: string;
  /** Parkdagi soni */
  quantity: number;
  /** Bugun bo'sh nusxalar soni */
  available_count: number;
  /** Hammasi band bo'lsa — birinchi qaytadigan mashinaning sanasi (YYYY-MM-DD) */
  next_free_date: string | null;
};

export type CarDetail = Car & {
  color: string;
  description: string;
  images: string[];
  /** Tasdiqlangan bronlar band qilgan kunlar (ikkala chegarasi ham band). */
  busy_ranges: { start: string; end: string }[];
};

export type Option = { value: string; label: string };
export type CarOptions = { car_types: Option[]; transmissions: Option[] };

export type BookingStatus = "new" | "confirmed" | "rejected" | "returned";

export type BookingStatusInfo = {
  reference: string;
  car_id: number;
  car_name: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  updated_at: string;
};

export class BackendError extends Error {}

async function backendGet<T>(path: string): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}${path}`, { cache: "no-store" });
  } catch (error) {
    unstable_rethrow(error); // Next'ning ichki signallari (masalan, "sahifa dinamik") o'tib ketsin
    throw new BackendError(`Backendga ulanib bo'lmadi: ${(error as Error).message}`);
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new BackendError(`Backend xatosi: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getCars(filters: Record<string, string | undefined> = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) query.set(key, value);
  }
  const suffix = query.size ? `?${query}` : "";
  return (await backendGet<Car[]>(`/api/cars/${suffix}`)) ?? [];
}

export async function getCar(id: number) {
  return backendGet<CarDetail>(`/api/cars/${id}/`);
}

export async function getBookingStatus(reference: string) {
  if (!/^RC-[A-Z0-9]{6}$/.test(reference)) return null;
  return backendGet<BookingStatusInfo>(`/api/bookings/${reference}/`);
}

export type Faq = { id: number; question: string; answer: string };

export async function getFaqs() {
  return (await backendGet<Faq[]>("/api/faqs/")) ?? [];
}

export async function getCarOptions() {
  return (await backendGet<CarOptions>("/api/cars/options/")) ?? { car_types: [], transmissions: [] };
}
