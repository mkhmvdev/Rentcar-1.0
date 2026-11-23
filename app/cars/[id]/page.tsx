import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Info } from "lucide-react";
import { getCar } from "@/lib/api";
import { addDays, formatDate, formatPrice, todayInTashkent } from "@/lib/format";
import { BookingForm } from "@/components/BookingForm";
import { CarGallery } from "@/components/CarGallery";

async function loadCar(id: string) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();
  const car = await getCar(numericId);
  if (!car) notFound();
  return car;
}

export async function generateMetadata({ params }: PageProps<"/cars/[id]">): Promise<Metadata> {
  const car = await loadCar((await params).id);
  return {
    title: `${car.name} ${car.year} ijarasi`,
    description: `${car.name} (${car.year}) — ${formatPrice(car.price_per_day)} / kun. ${car.transmission_label}, ${car.seats} o'rindiq.`,
    openGraph: car.image ? { images: [car.image] } : undefined,
  };
}

export default async function CarPage({ params }: PageProps<"/cars/[id]">) {
  const car = await loadCar((await params).id);
  const today = todayInTashkent();
  // Ijaradagi mashinaga faqat qaytarilgandan keyingi sanalar uchun zayavka qoldiriladi.
  const minStartDate = car.rented_until && car.rented_until >= today ? addDays(car.rented_until, 1) : today;
  const images = [car.image, ...car.images].filter((src): src is string => Boolean(src));

  const specs: [string, string][] = [
    ["Turi", car.car_type_label],
    ["Yili", String(car.year)],
    ["Uzatmalar qutisi", car.transmission_label],
    ["Yoqilg'i", car.fuel_type_label],
    ["O'rindiqlar", `${car.seats} ta`],
    ...(car.color ? ([["Rangi", car.color]] as [string, string][]) : []),
  ];

  return (
    <main className="container-shell py-6 sm:py-10">
      <Link href="/#mashinalar" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-brand">
        <ChevronLeft size={16} aria-hidden /> Barcha mashinalar
      </Link>

      <div className="mt-4 grid items-start gap-8 lg:grid-cols-[1fr_400px]">
        <section className={car.rented_until ? "opacity-70 grayscale" : ""}>
          <CarGallery name={car.name} images={images} />
        </section>

        <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6 lg:sticky lg:top-24 lg:row-span-2">
          <h1 className="text-2xl font-extrabold sm:text-3xl">{car.name}</h1>
          <p className="mt-1 text-slate-500">{car.brand} · {car.year}</p>
          <p className="mt-4 text-3xl font-extrabold text-brand">
            {formatPrice(car.price_per_day)}
            <span className="text-base font-medium text-slate-500"> / 1 kun</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">Yakuniy narx muddat va shartlarga qarab telefonda kelishiladi.</p>

          {car.rented_until && (
            <p className="mt-4 flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
              <Info size={18} className="shrink-0" aria-hidden />
              <span>
                Bu mashina hozir ijarada, <b>{formatDate(car.rented_until)}</b>gacha band. Keyingi sanalar uchun zayavka qoldirishingiz mumkin.
              </span>
            </p>
          )}

          <div className="mt-6 border-t border-slate-100 pt-6">
            <BookingForm carId={car.id} minStartDate={minStartDate} />
          </div>
        </aside>

        <section>
          <h2 className="text-xl font-extrabold">Xususiyatlari</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {specs.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="mt-1 font-bold">{value}</dd>
              </div>
            ))}
          </dl>
          {car.description && (
            <>
              <h2 className="mt-8 text-xl font-extrabold">Tavsif</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">{car.description}</p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
