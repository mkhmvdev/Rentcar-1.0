"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Smartphone, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [method,setMethod]=useState("Telefon");
  const [sent,setSent]=useState(false);
  return <><Navbar/><main className="container-shell grid min-h-[650px] place-items-center py-14"><section className="w-full max-w-md rounded-2xl bg-white p-7 card-shadow"><h1 className="text-3xl font-extrabold">Hisobga kirish</h1><p className="mt-2 text-sm text-slate-500">Xavfsiz kirish yoki ro‘yxatdan o‘tish.</p><div className="mt-6 grid grid-cols-2 gap-2">{[["Telefon",Smartphone],["Email",Mail]].map(([label,Icon])=>{const I=Icon as typeof Smartphone;return <button key={String(label)} type="button" onClick={()=>setMethod(String(label))} className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-bold ${method===label?"border-[#3563E9] bg-[#3563E9]/5 text-[#3563E9]":"border-slate-200"}`}><I size={17}/>{String(label)}</button>})}</div><label className="mt-5 block text-sm font-bold">{method==="Telefon"?"Telefon raqami":"Email manzil"}<input type={method==="Telefon"?"tel":"email"} placeholder={method==="Telefon"?"+998 90 123 45 67":"siz@pochta.uz"} className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 font-normal"/></label>{sent&&<label className="mt-4 block text-sm font-bold">Tasdiqlash kodi<input inputMode="numeric" placeholder="4 raqamli kod" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3"/></label>}<button type="button" onClick={()=>setSent(true)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3563E9] py-4 font-bold text-white"><ShieldCheck size={18}/>{sent?"Tasdiqlash":"Kod yuborish"}</button><div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200"/>yoki<span className="h-px flex-1 bg-slate-200"/></div><div className="grid grid-cols-2 gap-3"><button type="button" className="rounded-lg border border-slate-200 py-3 text-sm font-bold">Google</button><button type="button" className="rounded-lg border border-slate-200 py-3 text-sm font-bold">Apple</button></div></section></main><Footer/></>;
}
