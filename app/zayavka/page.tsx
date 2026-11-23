import { redirect } from "next/navigation";

/** Eski manzil: zayavkalar ro'yxati endi Profil sahifasida. */
export default function OldRequestsPage() {
  redirect("/profil");
}
