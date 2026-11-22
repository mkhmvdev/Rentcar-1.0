import Link from "next/link";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2" aria-label="MORENT bosh sahifasi">
      <svg width={compact ? 34 : 42} height={compact ? 34 : 42} viewBox="0 0 42 42" fill="none" aria-hidden="true">
        <rect width="42" height="42" rx="12" fill="#3563E9"/>
        <path d="M9 27V15.5C9 14.7 9.7 14 10.5 14H15L18 20L21 14H26L29 20L33 14V27H29V20L26 27H21L18 20V27H9Z" fill="white"/>
      </svg>
      <span className="text-[28px] font-extrabold tracking-tight text-[#3563E9]">MORENT</span>
    </Link>
  );
}
