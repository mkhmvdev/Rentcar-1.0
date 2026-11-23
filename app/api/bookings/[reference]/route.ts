import type { NextRequest } from "next/server";
import { BackendError, getBookingStatus } from "@/lib/api";

/** Brauzer zayavka holatini shu yerdan so'raydi; Next server uni Django'dan oladi. */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/bookings/[reference]">) {
  const { reference } = await ctx.params;
  try {
    const data = await getBookingStatus(reference.toUpperCase());
    if (!data) return Response.json({ detail: "Zayavka topilmadi" }, { status: 404 });
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof BackendError) return Response.json({ detail: "Server vaqtincha javob bermayapti" }, { status: 503 });
    throw error;
  }
}
