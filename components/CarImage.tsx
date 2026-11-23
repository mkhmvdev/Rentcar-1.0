import Image from "next/image";
import { CarFront } from "lucide-react";

/** Mashina rasmi; rasm yuklanmagan bo'lsa, oddiy belgi ko'rsatiladi. */
export function CarImage({ src, alt, priority = false, sizes }: { src: string | null; alt: string; priority?: boolean; sizes: string }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300" role="img" aria-label={alt}>
        <CarFront size={64} strokeWidth={1.25} aria-hidden />
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized className="object-cover" />;
}
