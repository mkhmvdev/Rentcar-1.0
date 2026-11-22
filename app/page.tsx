import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, CarFront, ShieldCheck, ArrowRight, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarCard } from "@/components/CarCard";
import { RentalForm } from "@/components/RentalForm";
import { cars } from "@/data/cars";

export const metadata={title:"Bosh sahifa | MORENT",description:"MORENT bilan qulay va ishonchli avtomobil ijarasi."};

export default function Home(){return(
<>
<Navbar/>
<main>
<section className="container-shell pt-8"><div className="tire-pattern relative overflow-hidden rounded-2xl bg-[#0b0f19] px-6 py-10 text-white md:min-h-[460px] md:px-14">
<div className="relative z-10 max-w-[520px]"><p className="mb-4 text-sm font-bold text-blue-300">Avtomobil ijarasi 2026</p><h1 className="text-4xl font-extrabold leading-tight md:text-[54px]">Yo‘lni hech qachon his qilmaganingizdek his qiling</h1><p className="mt-5 max-w-md text-sm leading-7 text-slate-300">Safaringizni qulay va unutilmas qilish uchun ideal avtomobilni bugun tanlang.</p><div className="mt-8 flex gap-3"><Link href="/vehicles" className="rounded-md bg-[#3563E9] px-5 py-3 text-sm font-bold">Hozir ijaraga olish</Link><Link href="/about" className="flex items-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-bold">Biz haqimizda <ArrowRight size={16}/></Link></div></div>
<Image src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1100&q=90" alt="Qora sport avtomobil" fill priority sizes="(max-width:768px) 100vw, 900px" className="z-0 object-cover object-right opacity-75 md:object-contain md:object-right"/>
</div></section>

<section className="container-shell grid gap-5 py-16 md:grid-cols-3">{[
["Qulaylik","Istalgan vaqtda mavjud avtomobillar va qulay bron qilish.",CalendarCheck],
["Komfort","Har bir yo‘l uchun toza, qulay va zamonaviy park.",CarFront],
["Tejamkorlik","Shaffof narxlar va yashirin to‘lovlarsiz ijaralar.",ShieldCheck],
].map(([title,text,Icon])=><article key={String(title)} className="card-shadow flex items-start gap-4 rounded-2xl bg-white p-6"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#3563E9]/10 text-[#3563E9]">{Icon && <Icon size={22}/>}</span><div><h2 className="font-bold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{text as string}</p></div></article>)}</section>

<section className="container-shell pb-16"><div className="mb-6 flex items-center justify-between"><h2 className="text-2xl font-bold">Mashhur avtomobillar</h2><Link href="/vehicles" className="flex items-center gap-2 text-sm font-bold text-[#3563E9]">Hammasi <ArrowRight size={16}/></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{cars.slice(0,4).map(car=><CarCard key={car.id} car={car}/>)}</div></section>

<section className="container-shell grid items-center gap-10 pb-20 md:grid-cols-2"><div className="relative h-[420px] overflow-hidden rounded-2xl"><Image src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=85" alt="Avtomobilda qulay sayohat" fill className="object-cover"/></div><div><p className="text-sm font-bold text-[#3563E9]">Nega aynan biz</p><h2 className="mt-3 text-3xl font-bold">Har safar uchun ishonchli tanlov</h2><div className="mt-8 space-y-6">{["Yuqori sifatli texnik holat","Moslashuvchan ijara shartlari","24/7 mijozlarni qo‘llab-quvvatlash","Transparent narxlar"].map((item,i)=><div key={item} className="flex gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#3563E9] text-sm font-bold text-white">{i+1}</span><div><h3 className="font-bold">{item}</h3><p className="mt-1 text-sm text-slate-500">Safaringiz davomida barcha ehtiyojlaringizni hisobga olamiz.</p></div></div>)}</div></div></section>

<section className="bg-[#3563E9] py-12 text-white"><div className="container-shell"><div className="mb-8"><p className="text-sm font-semibold text-blue-100">Raqamlarda</p><h2 className="mt-2 text-3xl font-bold">Bizning natijalarimiz</h2></div><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[["540+","Avtomobil"],["20k+","Mijoz"],["25+","Yillik tajriba"],["30m+","Masofa"]].map(([n,l])=> <div key={l} className="rounded-xl bg-white p-6 text-center text-slate-900"><b className="text-3xl text-[#3563E9]">{n}</b><p className="mt-2 text-sm text-slate-500">{l}</p></div>)}</div></div></section>

<section className="container-shell grid gap-5 py-16 md:grid-cols-2"><div className="tire-pattern relative min-h-52 rounded-2xl bg-[#3563E9] p-8 text-white"><h2 className="max-w-xs text-2xl font-bold">Avtomobil ijarasi uchun eng yaxshi platforma</h2><Link href="/vehicles" className="mt-6 inline-block rounded-md bg-white px-5 py-3 text-sm font-bold text-[#3563E9]">Avtomobillarni ko‘rish</Link></div><div className="relative min-h-52 overflow-hidden rounded-2xl bg-[#101010] p-8 text-white"><h2 className="relative z-10 max-w-xs text-2xl font-bold">Arzon narxda oson ijara</h2><Link href="/vehicles" className="relative z-10 mt-6 inline-block rounded-md bg-[#3563E9] px-5 py-3 text-sm font-bold">Hozir bron qilish</Link><Image src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=700&q=85" alt="Arzon ijara avtomobili" fill className="object-cover opacity-45"/></div></section>

<section className="container-shell pb-16"><RentalForm/></section>
<section className="container-shell pb-20"><div className="mb-6 flex items-center justify-between"><h2 className="text-2xl font-bold">Tavsiya etilgan avtomobillar</h2><button type="button" className="text-sm font-bold text-[#3563E9]">Ko‘proq ko‘rsatish</button></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{cars.slice(0,8).map(car=><CarCard key={`rec-${car.id}`} car={car}/>)}</div></section>
<section className="container-shell pb-16"><div className="tire-pattern flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#3563E9] p-8 text-white md:flex-row md:items-center"><div><p className="text-sm text-blue-100">Yangi sarguzashtlarga tayyormisiz?</p><h2 className="mt-2 text-3xl font-bold">Har bir kilometrdan zavqlaning</h2></div><div className="flex w-full max-w-md rounded-lg bg-white p-2"><span className="grid place-items-center px-3 text-slate-400"><MapPin size={18}/></span><input aria-label="Shaharni qidirish" className="min-w-0 flex-1 px-2 text-sm text-slate-800 outline-none" placeholder="Shahar yoki aeroport"/><button type="button" className="rounded-md bg-[#FFA500] px-5 py-3 text-sm font-bold text-slate-900">Qidirish</button></div></div></section>
</main><Footer/></>)}
