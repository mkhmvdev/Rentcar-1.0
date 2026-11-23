import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight } from "lucide-react";
import { getCars } from "@/lib/api";
import { CarCard } from "@/components/CarCard";

const HOME_LIMIT = 6;

export default async function HomePage() {
  const cars = await getCars();
  // Bugun bo'sh mashinalar oldinda.
  const featured = [...cars].sort((a, b) => Number(a.available_count === 0) - Number(b.available_count === 0)).slice(0, HOME_LIMIT);
  const freeUnits = cars.reduce((sum, car) => sum + car.available_count, 0);

  return (
    <ViewTransition
      enter={{ "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", default: "none" }}
      default="none"
    >
      <main className="container-shell py-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ijaraga <span className="text-brand">mashinalar</span>
            </h1>
            <p className="mt-2 text-muted">Mashinani tanlang, sanani belgilang — narx va shartlarni telefonda kelishamiz.</p>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted">
            <span className="size-2 rounded-full bg-ok" aria-hidden />
            Bugun <b className="text-ink">{freeUnits}</b> ta mashina bo&apos;sh
          </p>
        </div>

        {featured.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car, index) => <CarCard key={car.id} car={car} index={index} />)}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-line bg-surface p-12 text-center text-muted">Hozircha mashinalar qo&apos;shilmagan.</p>
        )}

        {cars.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/mashinalar"
              className="group inline-flex h-12 items-center gap-2 rounded-lg border border-brand px-6 font-bold text-brand transition hover:bg-brand hover:text-on-brand"
            >
              Barcha mashinalar ({cars.length})
              <ArrowRight size={18} className="transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        )}
      </main>
    </ViewTransition>
  );
}
