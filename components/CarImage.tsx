import Image from "next/image";

/** Rasm yuklanmagan mashina uchun oddiy siluet. */
function CarSilhouette({ label }: { label: string }) {
  return (
    <div className="relative flex h-full w-full items-end justify-center overflow-hidden bg-gradient-to-b from-subtle to-surface" role="img" aria-label={label}>
      <div className="absolute inset-x-0 bottom-[18%] h-px bg-line" aria-hidden />
      <svg viewBox="0 0 320 120" className="relative mb-[14%] w-[68%] text-faint" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M18 88h18m60 0h120m60 0h26c6 0 8-4 8-10v-8c0-8-6-12-14-14l-44-8-38-26c-6-4-12-6-20-6H120c-8 0-14 3-20 8L72 42l-38 6c-10 2-16 8-16 18v14c0 5 2 8 6 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M108 44l20-18h44l34 18z" strokeLinejoin="round" />
        <circle cx="66" cy="88" r="20" />
        <circle cx="246" cy="88" r="20" />
        <circle cx="66" cy="88" r="7" />
        <circle cx="246" cy="88" r="7" />
      </svg>
    </div>
  );
}

export function CarImage({ src, alt, priority = false, sizes }: { src: string | null; alt: string; priority?: boolean; sizes: string }) {
  if (!src) return <CarSilhouette label={alt} />;
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized className="object-cover" />;
}
