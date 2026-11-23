import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, CalendarDays, CarFront, Cog, Fuel, Palette, Users } from "lucide-react";
import { getCar } from "@/lib/api";
import { addDays, formatPrice, todayInTashkent } from "@/lib/format";
import { telegramLink } from "@/lib/site";
import { Availability } from "@/components/Availability";
import { BookingForm } from "@/components/BookingForm";
import { CarGallery } from "@/components/CarGallery";
import { Plate } from "@/components/Plate";

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
  const images = [car.image, ...car.images].filter((src): src is string => Boolean(src));
  const telegramHref = telegramLink(
    `Assalomu alaykum! ${car.name} (${car.year}${car.plate_number ? `, ${car.plate_number}` : ""}) mashinasini ijaraga olmoqchiman.`,
  );

  const specs = [
    [CarFront, "Turi", car.car_type_label],
    [CalendarDays, "Yili", String(car.year)],
    [Cog, "Uzatmalar qutisi", car.transmission_label],
    [Fuel, "Yoqilg'i", car.fuel_type_label],
    [Users, "O'rindiqlar", `${car.seats} ta`],
    ...(car.color ? [[Palette, "Rangi", car.color]] : []),
  ] as [typeof Cog, string, string][];

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", default: "none" }}
      exit={{ "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main className="container-shell py-6 sm:py-8">
        <Link
          href="/mashinalar"
          transitionTypes={["nav-back"]}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
        >
          <ArrowLeft size={16} className="transition group-hover:-translate-x-0.5" aria-hidden /> Barcha mashinalar
        </Link>

        <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-8">
            <CarGallery
              carId={car.id}
              name={car.name}
              images={images}
              overlay={
                car.plate_number ? (
                  <div className="absolute bottom-4 left-4">
                    <ViewTransition name={`car-plate-${car.id}`} share="morph" default="none">
                      <span className="inline-block"><Plate number={car.plate_number} size="md" /></span>
                    </ViewTransition>
                  </div>
                ) : null
              }
            />

            <section>
              <p className="text-sm font-semibold text-brand">{car.brand}</p>
              <ViewTransition name={`car-title-${car.id}`} share="morph" default="none">
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{car.name}</h1>
              </ViewTransition>
              <div className="mt-4">
                <Availability count={car.available_count} nextFree={car.next_free_date} size="md" />
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
                {specs.map(([Icon, label, value]) => (
                  <div key={label} className="bg-surface p-4">
                    <dt className="flex items-center gap-2 text-xs font-medium text-muted">
                      <Icon size={15} aria-hidden /> {label}
                    </dt>
                    <dd className="mt-1.5 font-bold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              {car.description && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold">Tavsif</h2>
                  <p className="mt-2 max-w-2xl whitespace-pre-line leading-relaxed text-ink/80">{car.description}</p>
                </div>
              )}
            </section>
          </div>

          <aside className="rounded-xl border border-line bg-surface p-5 sm:p-6 lg:sticky lg:top-20">
            <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="text-sm text-muted">1 kunlik narx</p>
                <p className="mt-0.5 whitespace-nowrap text-3xl font-extrabold text-ink">{formatPrice(car.price_per_day)}</p>
              </div>
              <p className="max-w-[10rem] text-right text-xs leading-snug text-muted">Yakuniy narx muddatga qarab telefonda kelishiladi</p>
            </div>
            <div className="pt-5">
              <BookingForm
                carId={car.id}
                busy={car.busy_ranges}
                minDate={today}
                maxDate={addDays(today, 365)}
                telegramHref={telegramHref}
              />
            </div>
          </aside>
        </div>
      </main>
    </ViewTransition>
  );
}
