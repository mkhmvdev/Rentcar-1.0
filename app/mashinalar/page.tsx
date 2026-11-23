import type { Metadata } from "next";
import { ViewTransition } from "react";
import { getCarOptions, getCars } from "@/lib/api";
import { CarCard } from "@/components/CarCard";
import { FilterChips, type Filters } from "@/components/FilterChips";

export const metadata: Metadata = { title: "Mashinalar" };

const pick = (value: string | string[] | undefined) => (typeof value === "string" && value ? value : undefined);

export default async function CarsPage({ searchParams }: PageProps<"/mashinalar">) {
  const params = await searchParams;
  const filters: Filters = { type: pick(params.type), transmission: pick(params.transmission), sort: pick(params.sort) };
  const [cars, options] = await Promise.all([getCars(filters), getCarOptions()]);
  // Saralash tanlanmagan bo'lsa, bugun bo'shlari oldinda.
  const sorted = filters.sort ? cars : [...cars].sort((a, b) => Number(a.available_count === 0) - Number(b.available_count === 0));

  return (
    <ViewTransition
      enter={{ "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", default: "none" }}
      default="none"
    >
      <main className="container-shell py-8 sm:py-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Mashinalar</h1>
        <p className="mt-2 text-muted">{cars.length} ta model topildi</p>

        <div className="mt-6">
          <FilterChips current={filters} carTypes={options.car_types} transmissions={options.transmissions} />
        </div>

        {sorted.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((car, index) => <CarCard key={car.id} car={car} index={index} />)}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-12 text-center">
            <p className="font-bold">Mashina topilmadi</p>
            <p className="mt-1 text-sm text-muted">Filtrlarni o&apos;zgartirib ko&apos;ring.</p>
          </div>
        )}
      </main>
    </ViewTransition>
  );
}
