"use client";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BrandLogo } from "@/components/BrandLogo";
const links=[["Bosh sahifa","/"],["Avtomobillar","/vehicles"],["Tafsilotlar","/vehicles/4"],["Biz haqimizda","/about"],["Aloqa","/contact"]] as const;
export function Navbar(){const[open,setOpen]=useState(false);const pathname=usePathname();return(
<header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur"><div className="container-shell flex h-20 items-center justify-between">
<BrandLogo/>
<div className="hidden lg:block"><LiquidNavbar activeHref={pathname} items={links.map(([label,href])=>({label,href}))}/></div>
<ShimmerButton
  type="button"
  onClick={() => { window.location.href = "tel:+998901234567"; }}
  aria-label="Telefon orqali yordam olish"
  className="hidden h-[58px] items-center gap-3 border-0 bg-white px-4 text-slate-900 shadow-[0_8px_24px_-16px_rgba(53,99,233,.55)] md:flex"
  shimmerColor="#3563E9"
  shimmerSize="0.07em"
  shimmerDuration="2.8s"
  background="rgba(255,255,255,1)"
  borderRadius="16px"
>
  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#3563E9] text-white"><Phone size={17}/></span>
  <span className="text-left"><small className="block text-xs text-slate-400">Yordam kerakmi?</small><b className="block text-sm text-slate-900">+998 90 123 45 67</b></span>
</ShimmerButton>
<div className="flex items-center gap-2"><Link href="/profile" className="hidden rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold md:block">Profil</Link><Link href="/login" className="hidden rounded-lg bg-[#3563E9] px-4 py-3 text-sm font-bold text-white sm:block">Kirish</Link><button type="button" aria-label={open?"Menyuni yopish":"Menyuni ochish"} aria-expanded={open} onClick={()=>setOpen(!open)} className="grid size-11 place-items-center rounded-lg border border-slate-200 lg:hidden">{open?<X/>:<Menu/>}</button></div></div>
{open&&<nav className="border-t border-slate-100 bg-white px-5 py-5 lg:hidden" aria-label="Mobil menyu"><div className="container-shell flex flex-col gap-4">{links.map(([l,h])=> <Link key={h} href={h} onClick={()=>setOpen(false)} className="font-semibold">{l}</Link>)}</div></nav>}
</header>)}
