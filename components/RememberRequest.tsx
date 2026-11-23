"use client";

import { useEffect } from "react";
import { saveRequest } from "@/lib/booking-status";

/** Havola orqali ochilgan zayavkani ham shu qurilmada eslab qoladi. */
export function RememberRequest({ reference }: { reference: string }) {
  useEffect(() => saveRequest(reference), [reference]);
  return null;
}
