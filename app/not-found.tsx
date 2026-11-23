import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-shell grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-extrabold">Sahifa topilmadi</h1>
        <p className="mt-2 text-slate-500">Bu mashina saytdan olib tashlangan yoki manzil noto&apos;g&apos;ri.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark">
          Mashinalarni ko&apos;rish
        </Link>
      </div>
    </main>
  );
}
