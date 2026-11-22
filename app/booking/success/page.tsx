import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function BookingSuccess() {
  return <><Navbar/><main className="container-shell grid min-h-[560px] place-items-center py-16"><div className="max-w-lg text-center"><CheckCircle2 size={72} className="mx-auto text-emerald-500"/><h1 className="mt-6 text-4xl font-extrabold">Bron tasdiqlandi!</h1><p className="mt-4 text-slate-500">Bron raqami: <b>#MORENT-2026-001</b>. Tasdiqlash ma’lumotlari telefoningizga yuborildi.</p><div className="mt-8 flex justify-center gap-3"><Link href="/profile" className="rounded-lg bg-[#3563E9] px-5 py-3 font-bold text-white">Profilga o‘tish</Link><Link href="/vehicles" className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-bold">Yana tanlash</Link></div></div></main><Footer/></>;
}
