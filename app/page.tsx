import { CalendarCheck, PhoneCall, MousePointerClick } from "lucide-react";
import { getCarOptions, getCars } from "@/lib/api";
import { CarCard } from "@/components/CarCard";
import { CarFilters } from "@/components/CarFilters";

const pick = (value: string | string[] | undefined) => (typeof value === "string" ? value : undefined);

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const filters = { type: pick(params.type), transmission: pick(params.transmission), sort: pick(params.sort) };
  const [cars, options] = await Promise.all([getCars(filters), getCarOptions()]);
  // Bo'sh mashinalar oldinda, ijaradagilar oxirida (tartib o'z ichida saqlanadi).
  const sorted = [...cars].sort((a, b) => Number(Boolean(a.rented_until)) - Number(Boolean(b.rented_until)));

  return (
    <main>
      <section className="bg-brand text-white">
        <div className="container-shell py-12 sm:py-16">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">Ijaraga mashina — tez va oson</h1>
          <p className="mt-4 max-w-xl text-white/85 sm:text-lg">
            Mashinani tanlang, sanani belgilang va zayavka qoldiring. Biz qo&apos;ng&apos;iroq qilib, narx va shartlarni kelishamiz.
          </p>
          <ol className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
            {[
              [MousePointerClick, "Mashina tanlang"],
              [CalendarCheck, "Sana va raqamingizni qoldiring"],
              [PhoneCall, "Qo'ng'iroqni kuting"],
            ].map(([Icon, text], index) => {
              const I = Icon as typeof PhoneCall;
              return (
                <li key={index} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                  <I size={20} aria-hidden />
                  <span><b>{index + 1}.</b> {text as string}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="mashinalar" className="container-shell scroll-mt-20 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Mashinalar</h2>
            <p className="mt-1 text-sm text-slate-500">{cars.length} ta mashina topildi</p>
          </div>
          <div className="lg:w-[640px]">
            <CarFilters current={filters} carTypes={options.car_types} transmissions={options.transmissions} />
          </div>
        </div>

        {sorted.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl bg-white p-8 text-center text-slate-500 ring-1 ring-slate-200">
            Bu filtrlar bo&apos;yicha mashina topilmadi.
          </p>
        )}
      </section>
    </main>
  );
}
