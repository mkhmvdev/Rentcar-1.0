import type { Metadata } from "next";
import { Info } from "lucide-react";
import { MyRequests } from "@/components/MyRequests";

export const metadata: Metadata = { title: "Profil", robots: { index: false } };

export default function ProfilePage() {
  return (
    <main className="container-shell max-w-3xl py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Profil</h1>
      <p className="mt-2 text-muted">Zayavkalaringiz va ularning holati. Holat admin javob berishi bilan o&apos;zi yangilanadi.</p>

      <p className="mt-6 flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm text-muted">
        <Info size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
        <span>
          Ro&apos;yxatdan o&apos;tish shart emas: zayavkalar shu qurilmada eslab qolinadi. Boshqa telefon yoki brauzerdan kirsangiz,
          zayavka havolasini (masalan, <span className="font-plate text-ink">/zayavka/RC-XXXXXX</span>) ochsangiz kifoya.
        </span>
      </p>

      <h2 className="mt-10 text-lg font-bold">Mening zayavkalarim</h2>
      <div className="mt-4">
        <MyRequests />
      </div>
    </main>
  );
}
