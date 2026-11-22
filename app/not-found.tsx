import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <div className="mx-auto grid size-28 place-items-center rounded-full bg-[#3563E9]/10 text-5xl font-extrabold text-[#3563E9]">404</div>
        <h1 className="mt-8 text-4xl font-extrabold">Yo‘l topilmadi</h1>
        <p className="mt-3 text-slate-500">Bu sahifa mavjud emas yoki boshqa manzilga ko‘chirilgan.</p>
        <Link href="/" className="mt-7 inline-block rounded-lg bg-[#3563E9] px-6 py-4 font-bold text-white">Bosh sahifaga qaytish</Link>
      </div>
    </main>
  );
}
