"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftRight, CalendarDays, Clock3, MapPin } from "lucide-react";

const schema=z.object({location:z.string().min(2,"Manzilni tanlang"),date:z.string().min(1,"Sanani tanlang"),time:z.string().min(1,"Vaqtni tanlang")});
type FormData=z.infer<typeof schema>;
export function RentalForm({dark=false}:{dark?:boolean}){const{register,handleSubmit,formState:{errors},reset}=useForm<FormData>({resolver:zodResolver(schema)});
return <form onSubmit={handleSubmit(()=>reset())} className={`grid items-end gap-3 rounded-2xl p-5 ${dark?"bg-white":"bg-white card-shadow"}`}>
<div className="grid gap-3 sm:grid-cols-[1fr_44px_1fr]">
<fieldset><legend className="mb-3 flex items-center gap-2 font-bold"><span className="size-2 rounded-full bg-[#3563E9]"/> Olib ketish</legend><div className="grid grid-cols-3 gap-2"><label className="text-xs text-slate-500">Joylashuv<span className="mt-2 flex items-center rounded-lg border border-slate-200 px-3"><MapPin size={15}/><input aria-label="Olib ketish joyi" {...register("location")} className="w-full px-2 py-3 outline-none" placeholder="Shahar"/></span></label><label className="text-xs text-slate-500">Sana<span className="mt-2 flex items-center rounded-lg border border-slate-200 px-2"><CalendarDays size={15}/><input aria-label="Olib ketish sanasi" type="date" {...register("date")} className="w-full px-1 py-3 outline-none"/></span></label><label className="text-xs text-slate-500">Vaqt<span className="mt-2 flex items-center rounded-lg border border-slate-200 px-2"><Clock3 size={15}/><input aria-label="Olib ketish vaqti" type="time" {...register("time")} className="w-full px-1 py-3 outline-none"/></span></label></div></fieldset>
<button type="button" aria-label="Olib ketish va qaytarish joyini almashtirish" className="mx-auto mb-1 grid size-11 place-items-center rounded-lg bg-[#3563E9] text-white sm:mb-4"><ArrowLeftRight size={18}/></button>
<fieldset><legend className="mb-3 flex items-center gap-2 font-bold"><span className="size-2 rounded-full bg-[#3563E9]"/> Qaytarish</legend><div className="grid grid-cols-3 gap-2"><label className="text-xs text-slate-500">Joylashuv<span className="mt-2 flex items-center rounded-lg border border-slate-200 px-3"><MapPin size={15}/><input aria-label="Qaytarish joyi" className="w-full px-2 py-3 outline-none" placeholder="Shahar"/></span></label><label className="text-xs text-slate-500">Sana<span className="mt-2 flex items-center rounded-lg border border-slate-200 px-2"><CalendarDays size={15}/><input aria-label="Qaytarish sanasi" type="date" className="w-full px-1 py-3 outline-none"/></span></label><label className="text-xs text-slate-500">Vaqt<span className="mt-2 flex items-center rounded-lg border border-slate-200 px-2"><Clock3 size={15}/><input aria-label="Qaytarish vaqti" type="time" className="w-full px-1 py-3 outline-none"/></span></label></div></fieldset>
</div>
{(errors.location||errors.date||errors.time)&&<p className="text-xs text-red-500">{errors.location?.message||errors.date?.message||errors.time?.message}</p>}
</form>}
