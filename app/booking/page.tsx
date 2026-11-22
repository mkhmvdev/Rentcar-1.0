"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Check, ChevronLeft, ChevronRight, ShieldCheck, UserRound, Baby, Navigation } from "lucide-react";

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [days, setDays] = useState(3);
  const [extras, setExtras] = useState({ insurance: true, driver: false, childSeat: false, gps: false });
  const [coupon, setCoupon] = useState("");
  const base = 99 * days;
  const extrasTotal = (extras.insurance ? 12 * days : 0) + (extras.driver ? 20 * days : 0) + (extras.childSeat ? 8 * days : 0) + (extras.gps ? 5 * days : 0);
  const discount = coupon.trim().toUpperCase() === "MORENT10" ? base * 0.1 : 0;
  const total = base + extrasTotal - discount;

  return (
    <>
      <Navbar />
      <main className="container-shell py-14">
        <p className="text-sm font-bold text-[#3563E9]">Xavfsiz bron qilish</p>
        <h1 className="mt-2 text-4xl font-extrabold">Avtomobilni band qilish</h1>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl bg-white p-6 card-shadow">
            <div className="mb-8 grid grid-cols-3 gap-2">
              {[["1","Sayohat"],["2","Qo‘shimchalar"],["3","To‘lov"]].map(([number,label]) => (
                <div key={number} className="flex items-center gap-2">
                  <span className={`grid size-8 place-items-center rounded-full text-sm font-bold ${Number(number)<=step?"bg-[#3563E9] text-white":"bg-slate-100 text-slate-400"}`}>{Number(number)<step?<Check size={16}/>:number}</span>
                  <span className="hidden text-sm font-bold sm:block">{label}</span>
                </div>
              ))}
            </div>
            {step===1&&<div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold">Olib ketish joyi<input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 font-normal" defaultValue="Toshkent aeroporti"/></label>
              <label className="text-sm font-bold">Qaytarish joyi<input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 font-normal" defaultValue="Toshkent shahar markazi"/></label>
              <label className="text-sm font-bold">Olib ketish sanasi<input type="date" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 font-normal"/></label>
              <label className="text-sm font-bold">Qaytarish sanasi<input type="date" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 font-normal"/></label>
              <label className="text-sm font-bold sm:col-span-2">Ijara kuni<input type="range" min="1" max="14" value={days} onChange={e=>setDays(Number(e.target.value))} className="mt-4 w-full accent-[#3563E9]"/><span className="mt-2 block text-[#3563E9]">{days} kun</span></label>
            </div>}
            {step===2&&<div className="grid gap-3 sm:grid-cols-2">
              {[
                ["insurance","Keng sug‘urta",ShieldCheck],
                ["driver","Qo‘shimcha haydovchi",UserRound],
                ["childSeat","Bolalar o‘rindig‘i",Baby],
                ["gps","GPS navigator",Navigation],
              ].map(([key,label,Icon]) => {
                const typedKey=key as keyof typeof extras;
                const IconComponent=Icon as typeof ShieldCheck;
                return <button key={String(key)} type="button" onClick={()=>setExtras(v=>({...v,[typedKey]:!v[typedKey]}))} className={`flex items-center justify-between rounded-xl border p-4 text-left ${extras[typedKey]?"border-[#3563E9] bg-[#3563E9]/5":"border-slate-200"}`}><span className="flex items-center gap-3"><IconComponent size={20}/><b>{String(label)}</b></span>{extras[typedKey]&&<Check className="text-[#3563E9]" size={18}/>}</button>;
              })}
            </div>}
            {step===3&&<div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Karta raqami<input inputMode="numeric" placeholder="0000 0000 0000 0000" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3"/></label><label className="text-sm font-bold">Amal qilish muddati<input placeholder="MM/YY" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3"/></label></div>
              <label className="block text-sm font-bold">Promo-kod<div className="mt-2 flex gap-2"><input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="MORENT10" className="flex-1 rounded-lg border border-slate-200 px-4 py-3"/><button type="button" className="rounded-lg bg-slate-900 px-5 text-sm font-bold text-white">Qo‘llash</button></div></label>
              <label className="flex gap-3 text-sm text-slate-600"><input type="checkbox" defaultChecked/> Bronlash shartlari va bekor qilish siyosatini qabul qilaman.</label>
            </div>}
            <div className="mt-8 flex justify-between">
              <button type="button" disabled={step===1} onClick={()=>setStep(v=>v-1)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 font-bold disabled:opacity-40"><ChevronLeft size={18}/> Orqaga</button>
              {step<3?<button type="button" onClick={()=>setStep(v=>v+1)} className="flex items-center gap-2 rounded-lg bg-[#3563E9] px-5 py-3 font-bold text-white">Davom etish <ChevronRight size={18}/></button>:<a href="/booking/success" className="rounded-lg bg-[#FFA500] px-6 py-3 font-bold text-slate-900">Tasdiqlash va to‘lash</a>}
            </div>
          </section>
          <aside className="rounded-2xl bg-white p-6 card-shadow">
            <h2 className="text-xl font-bold">Buyurtma hisoboti</h2>
            <div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span>Avtomobil</span><b>Koenigsegg</b></div><div className="flex justify-between"><span>Asosiy ijara</span><b>${base}</b></div><div className="flex justify-between"><span>Qo‘shimchalar</span><b>${extrasTotal}</b></div>{discount>0&&<div className="flex justify-between text-emerald-600"><span>Chegirma</span><b>-${discount}</b></div>}<div className="border-t pt-4 flex justify-between text-lg"><b>Jami</b><b className="text-[#3563E9]">${total}</b></div></div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
