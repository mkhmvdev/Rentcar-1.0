import Link from "next/link";
import { Cog, Fuel, Users } from "lucide-react";
import type { Car } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { CarImage } from "@/components/CarImage";

export function CarCard({ car }: { car: Car }) {
  const rented = Boolean(car.rented_until);
  return (
    <Link
      href={`/cars/${car.id}`}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md ${
        rented ? "opacity-60 grayscale" : ""
      }`}
    >
      <div className="relative aspect-[16/10]">
        <CarImage src={car.image} alt={car.name} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        {rented && car.rented_until && (
          <span className="absolute left-3 top-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white">
            Ijarada · {formatDate(car.rented_until)}gacha
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold leading-snug group-hover:text-brand">{car.name}</h3>
          <span className="shrink-0 text-sm text-slate-500">{car.year}</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">{car.car_type_label}</p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <li className="flex items-center gap-1.5"><Cog size={15} aria-hidden />{car.transmission_label}</li>
          <li className="flex items-center gap-1.5"><Fuel size={15} aria-hidden />{car.fuel_type_label}</li>
          <li className="flex items-center gap-1.5"><Users size={15} aria-hidden />{car.seats} kishi</li>
        </ul>
        <p className="mt-auto pt-4 text-lg font-extrabold">
          {formatPrice(car.price_per_day)}
          <span className="text-sm font-medium text-slate-500"> / kun</span>
        </p>
      </div>
    </Link>
  );
}
