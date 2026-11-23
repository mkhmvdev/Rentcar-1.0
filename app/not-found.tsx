import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-shell grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-3 text-2xl font-extrabold">Sahifa topilmadi</h1>
        <p className="mt-2 text-muted">Bu sahifa mavjud emas yoki manzil noto&apos;g&apos;ri.</p>
        <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-lg bg-brand px-6 font-bold text-on-brand hover:bg-brand-hover">
          Mashinalarni ko&apos;rish
        </Link>
      </div>
    </main>
  );
}
