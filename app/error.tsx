"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <h1 className="text-4xl font-extrabold">Xatolik yuz berdi</h1>
        <p className="mt-3 text-slate-500">Ma’lumotlarni qayta yuklab ko‘ring yoki bosh sahifaga qayting.</p>
        <div className="mt-7 flex justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-lg bg-[#3563E9] px-5 py-3 font-bold text-white">Qayta urinish</button>
          <Link href="/" className="rounded-lg border border-slate-200 px-5 py-3 font-bold">Bosh sahifa</Link>
        </div>
      </div>
    </main>
  );
}
