"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, MapPin, Share2, Star, X, ZoomIn } from "lucide-react";
import type { Car } from "@/data/cars";

export function CarDetailTools({ car }: { car: Car }) {
  const [zoom,setZoom]=useState(false);
  const [review,setReview]=useState("");

  const share=async()=>{try{await navigator.share?.({title:car.name,text:`MORENT: ${car.name}`,url:window.location.href})}catch{}};
  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={()=>setZoom(true)} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold"><ZoomIn size={17}/> Rasmni kattalashtirish</button>
        <button type="button" onClick={share} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold"><Share2 size={17}/> Ulashish</button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-emerald-50 p-4"><p className="flex items-center gap-2 text-sm font-bold text-emerald-700"><CalendarDays size={17}/> Mavjudlik</p><p className="mt-1 text-xs text-emerald-700">{car.available?"Bugun mavjud":"Hozir band"}</p></div>
        <div className="rounded-xl bg-blue-50 p-4"><p className="flex items-center gap-2 text-sm font-bold text-[#3563E9]"><Star size={17}/> Reyting</p><p className="mt-1 text-xs text-slate-600">{car.rating} • 124 fikr</p></div>
        <div className="rounded-xl bg-orange-50 p-4"><p className="flex items-center gap-2 text-sm font-bold text-orange-700"><MapPin size={17}/> Toshkent markazi</p><p className="mt-1 text-xs text-orange-700">Borish 2 daqiqa</p></div>
      </div>
      <div className="mt-6 rounded-2xl bg-white p-5 card-shadow">
        <h3 className="font-bold">Avtomobilga sharh</h3>
        <textarea value={review} onChange={e=>setReview(e.target.value)} placeholder="Tajribangiz haqida yozing..." className="mt-3 min-h-24 w-full rounded-lg border border-slate-200 p-3 text-sm"/>
        <button type="button" onClick={()=>setReview("")} className="mt-3 rounded-lg bg-[#3563E9] px-4 py-3 text-sm font-bold text-white">Sharhni yuborish</button>
      </div>
      {zoom&&<div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/90 p-5" role="dialog" aria-modal="true" aria-label={`${car.name} rasmi`}><button type="button" onClick={()=>setZoom(false)} aria-label="Yopish" className="absolute right-6 top-6 grid size-11 place-items-center rounded-full bg-white"><X/></button><div className="relative h-[80vh] w-[90vw]"><Image src={car.image} alt={`${car.name} katta ko‘rinish`} fill sizes="90vw" className="rounded-2xl object-contain"/></div></div>}
    </>
  );
}
