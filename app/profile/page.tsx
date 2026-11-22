"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Heart, IdCard, Bell, ShieldCheck, LogOut, Clock3 } from "lucide-react";

export default function ProfilePage() {
  const [tab,setTab]=useState("Bronlar");
  return <><Navbar/><main className="container-shell py-14"><h1 className="text-4xl font-extrabold">Mening profilim</h1><div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]"><aside className="h-fit rounded-2xl bg-white p-5 card-shadow"><div className="grid size-20 place-items-center rounded-full bg-[#3563E9] text-2xl font-extrabold text-white">AM</div><b className="mt-4 block">Azizbek Mirzayev</b><p className="text-sm text-slate-500">+998 90 123 45 67</p><nav className="mt-6 space-y-2">{[["Bronlar",Clock3],["Sevimlilar",Heart],["Hujjatlar",IdCard],["Bildirishnomalar",Bell],["Xavfsizlik",ShieldCheck],["Chiqish",LogOut]].map(([label,Icon])=>{const I=Icon as typeof Heart;return <button key={String(label)} type="button" onClick={()=>setTab(String(label))} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold ${tab===label?"bg-[#3563E9]/10 text-[#3563E9]":"text-slate-600"}`}><I size={18}/>{String(label)}</button>})}</nav></aside><section className="rounded-2xl bg-white p-6 card-shadow"><h2 className="text-2xl font-bold">{tab}</h2>{tab==="Bronlar"?<div className="mt-5 rounded-xl border border-slate-200 p-5"><div className="flex flex-wrap justify-between gap-3"><div><b>Koenigsegg</b><p className="mt-1 text-sm text-slate-500">22.11.2026 — 25.11.2026</p></div><span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">Faol</span></div></div>:<p className="mt-5 text-sm text-slate-500">{tab} bo‘limi uchun ma’lumotlar va sozlamalar.</p>}</section></div></main><Footer/></>;
}
