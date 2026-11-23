"use server";

import { headers } from "next/headers";
import { BACKEND_URL } from "@/lib/api";

export type BookingField = "customer_name" | "phone" | "start_date" | "end_date" | "car";

export type BookingState =
  | { status: "idle" }
  | { status: "error"; message?: string; fieldErrors: Partial<Record<BookingField, string>>; values: Record<string, string> }
  | { status: "success"; reference: string; customerName: string };

const FIELDS: BookingField[] = ["car", "customer_name", "phone", "start_date", "end_date"];

/** Mijoz IP manzili (eng yaqin proxy qo'shgan oxirgi qiymat) — backend spam cheklovi uchun. */
async function clientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",").map((part) => part.trim()).filter(Boolean);
  return forwarded?.at(-1) ?? h.get("x-real-ip") ?? undefined;
}

export async function createBooking(carId: number, _prev: BookingState, formData: FormData): Promise<BookingState> {
  const values: Record<string, string> = {};
  for (const field of FIELDS) values[field] = String(formData.get(field) ?? "").trim();
  values.car = String(carId);

  const ip = await clientIp();
  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/api/bookings/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(ip ? { "X-Forwarded-For": ip } : {}) },
      body: JSON.stringify({ ...values, car: carId }),
      cache: "no-store",
    });
  } catch {
    return { status: "error", message: "Server bilan aloqa yo'q. Birozdan keyin qayta urinib ko'ring.", fieldErrors: {}, values };
  }

  if (response.status === 201) {
    const data = (await response.json()) as { reference: string; customer_name: string };
    return { status: "success", reference: data.reference, customerName: data.customer_name };
  }
  if (response.status === 429) {
    return { status: "error", message: "Juda ko'p urinish bo'ldi. Iltimos, keyinroq qayta urinib ko'ring.", fieldErrors: {}, values };
  }
  if (response.status === 400) {
    const body = (await response.json().catch(() => ({}))) as Record<string, string[] | string>;
    const fieldErrors: Partial<Record<BookingField, string>> = {};
    for (const field of FIELDS) {
      const error = body[field];
      if (error) fieldErrors[field] = Array.isArray(error) ? error[0] : error;
    }
    const other = body.non_field_errors ?? body.detail;
    return {
      status: "error",
      message: other ? (Array.isArray(other) ? other[0] : other) : fieldErrors.car,
      fieldErrors,
      values,
    };
  }
  return { status: "error", message: "Zayavkani yuborib bo'lmadi. Iltimos, qayta urinib ko'ring.", fieldErrors: {}, values };
}
