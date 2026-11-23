"use client";

import Link, { useLinkStatus } from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { ArrowRight, Cog, Fuel, Users } from "lucide-react";
import type { Car } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Availability } from "@/components/Availability";
import { CarImage } from "@/components/CarImage";
import { Plate } from "@/components/Plate";

function PendingBar() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`absolute inset-x-0 top-0 z-10 h-0.5 origin-left bg-brand transition-transform duration-700 ${pending ? "scale-x-100" : "scale-x-0"}`}
    />
  );
}

export function CarCard({ car, index }: { car: Car; index: number }) {
  const soldOut = car.available_count === 0;
  return (
    <Link
      href={`/cars/${car.id}`}
      transitionTypes={["nav-forward"]}
      style={{ "--i": index } as CSSProperties}
      className="reveal group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:border-brand/50 hover:shadow-[0_8px_30px_rgb(0_0_0/0.45)] focus-visible:outline-2 focus-visible:outline-brand"
    >
      <PendingBar />
      <div className={`relative aspect-[16/10] overflow-hidden ${soldOut ? "grayscale" : ""}`}>
        <ViewTransition name={`car-photo-${car.id}`} share="morph" default="none">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
            <CarImage src={car.image} alt={car.name} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          </div>
        </ViewTransition>
        {car.plate_number && (
          <div className="absolute bottom-3 left-3">
            <ViewTransition name={`car-plate-${car.id}`} share="morph" default="none">
              <span className="inline-block"><Plate number={car.plate_number} size="sm" /></span>
            </ViewTransition>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-md bg-page/80 px-2 py-1 text-[11px] font-semibold text-ink ring-1 ring-line backdrop-blur">
          {car.car_type_label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <ViewTransition name={`car-title-${car.id}`} share="morph" default="none">
            <h3 className="text-[17px] font-bold leading-snug text-ink">{car.name}</h3>
          </ViewTransition>
          <span className="mt-0.5 shrink-0 text-sm font-medium text-muted">{car.year}</span>
        </div>

        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
          <li className="flex items-center gap-1.5"><Cog size={14} aria-hidden />{car.transmission_label}</li>
          <li className="flex items-center gap-1.5"><Fuel size={14} aria-hidden />{car.fuel_type_label}</li>
          <li className="flex items-center gap-1.5"><Users size={14} aria-hidden />{car.seats} kishi</li>
        </ul>

        <div className="mt-3">
          <Availability count={car.available_count} nextFree={car.next_free_date} />
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
          <p>
            <span className="text-xl font-extrabold text-brand">{formatPrice(car.price_per_day)}</span>
            <span className="text-sm text-muted"> / kun</span>
          </p>
          <span className="flex items-center gap-1 text-sm font-semibold text-brand">
            Batafsil <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
