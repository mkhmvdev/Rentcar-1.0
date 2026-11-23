import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBookingStatus } from "@/lib/api";
import { StatusTracker } from "@/components/StatusTracker";
import { RememberRequest } from "@/components/RememberRequest";

export const metadata: Metadata = { title: "Zayavka holati", robots: { index: false } };

export default async function RequestPage({ params }: PageProps<"/zayavka/[reference]">) {
  const reference = (await params).reference.toUpperCase();
  const booking = await getBookingStatus(reference);
  if (!booking) notFound();

  return (
    <main className="container-shell max-w-2xl py-10">
      <Link href="/profil" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft size={16} aria-hidden /> Profil — barcha zayavkalarim
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Zayavka holati</h1>
      <div className="mt-6">
        <StatusTracker initial={booking} />
      </div>
      <RememberRequest reference={booking.reference} />
    </main>
  );
}
