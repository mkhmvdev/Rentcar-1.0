"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container-shell grid min-h-[60vh] place-items-center text-center">
      <div>
        <h1 className="text-2xl font-extrabold">Ma&apos;lumotlarni yuklab bo&apos;lmadi</h1>
        <p className="mt-2 text-muted">Server vaqtincha javob bermayapti. Birozdan keyin qayta urinib ko&apos;ring.</p>
        <button type="button" onClick={reset} className="mt-6 h-11 rounded-lg bg-brand px-6 font-bold text-on-brand hover:bg-brand-hover">
          Qayta urinish
        </button>
      </div>
    </main>
  );
}
