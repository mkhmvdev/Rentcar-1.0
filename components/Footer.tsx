import { BrandLogo } from "@/components/BrandLogo";
export function Footer(){return(
<footer className="border-t border-slate-200 bg-white"><div className="container-shell grid gap-10 py-14 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
<div><BrandLogo/><p className="mt-4 max-w-[280px] text-sm leading-7 text-slate-500">Bizning ijaramiz orqali siz doim o‘zingizga qulay mashinani topishingiz mumkin.</p></div>
<div><h3 className="mb-5 font-bold">Biz haqimizda</h3><div className="space-y-3 text-sm text-slate-500"><p>Why Us</p><p>Brendlar</p><p>Hamkorlik</p></div></div>
<div><h3 className="mb-5 font-bold">Jamiyat</h3><div className="space-y-3 text-sm text-slate-500"><p>Events</p><p>Blog</p><p>Podcast</p></div></div>
<div><h3 className="mb-5 font-bold">Ijtimoiy tarmoqlar</h3><div className="space-y-3 text-sm text-slate-500"><p>Discord</p><p>Instagram</p><p>X (Twitter)</p></div></div>
</div><div className="container-shell flex flex-col gap-4 border-t border-slate-100 py-6 text-sm text-slate-500 sm:flex-row sm:justify-between"><b>©2026 MORENT. Barcha huquqlar himoyalangan</b><div className="flex gap-8"><span>Privacy &amp; Policy</span><span>Terms &amp; Condition</span></div></div></footer>)}
