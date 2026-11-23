"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container-shell grid min-h-[60vh] place-items-center text-center">
      <div>
        <h1 className="text-2xl font-extrabold">Ma&apos;lumotlarni yuklab bo&apos;lmadi</h1>
        <p className="mt-2 text-slate-500">Server vaqtincha javob bermayapti. Birozdan keyin qayta urinib ko&apos;ring.</p>
        <button type="button" onClick={reset} className="mt-6 rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark">
          Qayta urinish
        </button>
      </div>
    </main>
  );
}
