"use client";

import { useState } from "react";
import { CarImage } from "@/components/CarImage";

export function CarGallery({ name, images }: { name: string; images: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <CarImage src={images[active] ?? null} alt={name} priority sizes="(min-width: 1024px) 60vw, 100vw" />
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
              className={`relative aspect-[4/3] overflow-hidden rounded-lg ring-2 ${index === active ? "ring-brand" : "ring-transparent"}`}
            >
              <CarImage src={src} alt="" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
