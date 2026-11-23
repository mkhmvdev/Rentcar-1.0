"use client";

import { useState, ViewTransition, type ReactNode } from "react";
import { CarImage } from "@/components/CarImage";

export function CarGallery({ carId, name, images, overlay }: { carId: number; name: string; images: string[]; overlay?: ReactNode }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line">
        <ViewTransition name={`car-photo-${carId}`} share="morph" default="none">
          <div className="absolute inset-0">
            <CarImage src={images[active] ?? null} alt={name} priority sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
        </ViewTransition>
        {overlay}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${index + 1}-rasm`}
              aria-pressed={index === active}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg ring-2 transition ${index === active ? "ring-brand" : "opacity-60 ring-transparent hover:opacity-100"}`}
            >
              <CarImage src={src} alt="" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
