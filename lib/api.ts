import "server-only";

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
  /** Mashina hozir ijarada bo'lsa — qaytarish sanasi (YYYY-MM-DD), aks holda null. */
  rented_until: string | null;
};

export type CarDetail = Car & {
  color: string;
  description: string;
  images: string[];
};

export type Option = { value: string; label: string };
export type CarOptions = { car_types: Option[]; transmissions: Option[] };

export class BackendError extends Error {}

async function backendGet<T>(path: string): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}${path}`, { cache: "no-store" });
  } catch (error) {
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

export async function getCarOptions() {
  return (await backendGet<CarOptions>("/api/cars/options/")) ?? { car_types: [], transmissions: [] };
}
