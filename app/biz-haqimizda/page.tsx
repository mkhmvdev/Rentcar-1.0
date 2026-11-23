import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, CarFront, Handshake, PhoneCall, ShieldCheck, UserRoundCheck } from "lucide-react";
import { connection } from "next/server";
import { getCars } from "@/lib/api";
import { site, telegramLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Biz haqimizda",
  description: `${site.name} — avtomobil ijarasi xizmati. Qanday ishlaymiz va nega bizni tanlashadi.`,
};

const STEPS = [
  [CarFront, "Mashinani tanlang", "Ro'yxatdan o'zingizga mos mashinani toping. Har birining bugun nechtasi bo'shligi ko'rsatilgan."],
  [CalendarCheck, "Sanani belgilang", "Kalendarda bo'sh kunlarni tanlab, ismingiz va telefon raqamingizni qoldiring."],
  [PhoneCall, "Qo'ng'iroqni kuting", "Administrator qo'ng'iroq qilib, narx va shartlarni kelishadi va bronni tasdiqlaydi."],
] as const;

const VALUES = [
  [UserRoundCheck, "Ro'yxatdan o'tish shart emas", "Zayavka uchun ism va telefon raqami yetarli."],
  [Handshake, "Narx kelishiladi", "Saytda 1 kunlik narx ko'rsatiladi, yakuniy narx muddat va shartlarga qarab kelishiladi."],
  [ShieldCheck, "Ochiq holat", "Zayavkangiz holatini saytda kuzatib borasiz: ko'rib chiqilmoqda, tasdiqlandi yoki rad etildi."],
] as const;

export default async function AboutPage() {
  await connection(); // har so'rovda yangi ma'lumot (build paytida backend talab qilinmaydi)
  const cars = await getCars().catch(() => []);
  const units = cars.reduce((sum, car) => sum + car.quantity, 0);
  const tg = telegramLink();

  return (
    <main className="container-shell max-w-4xl py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Biz haqimizda</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {site.name} — qulay va ishonchli <span className="text-brand">avtomobil ijarasi</span>
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        Biz kerakli kunlarga mashinani tez va ortiqcha rasmiyatchiliksiz ijaraga berish uchun ishlaymiz.
        Mashinani saytda tanlaysiz, qolganini administrator telefon orqali siz bilan kelishadi.
        {units > 0 && <> Hozir parkimizda <b className="text-ink">{units} ta</b> mashina bor.</>}
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Qanday ishlaymiz</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {STEPS.map(([Icon, title, text], i) => (
            <li key={title} className="rounded-xl border border-line bg-surface p-5">
              <span className="grid size-11 place-items-center rounded-lg bg-brand-soft text-brand" aria-hidden>
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-bold"><span className="text-muted">{i + 1}.</span> {title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Nega bizni tanlashadi</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {VALUES.map(([Icon, title, text]) => (
            <li key={title} className="flex gap-4 rounded-xl border border-line bg-surface p-5 sm:block">
              <Icon size={22} className="shrink-0 text-brand" aria-hidden />
              <div className="sm:mt-3">
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 flex flex-col gap-5 rounded-xl border border-brand/30 bg-brand-soft p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Savolingiz bormi?</h2>
          <p className="mt-1 text-sm text-muted">
            {site.phone ? <>Qo&apos;ng&apos;iroq qiling: <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-semibold text-ink hover:text-brand">{site.phone}</a>{tg ? " yoki Telegramda yozing." : "."}</> : "FAQ sahifasida savolingizni qoldiring, biz bog'lanamiz."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/mashinalar" className="inline-flex h-11 items-center rounded-lg bg-brand px-5 font-bold text-on-brand transition hover:bg-brand-hover">
            Mashinalarni ko&apos;rish
          </Link>
          <Link href="/faq#savol" className="inline-flex h-11 items-center rounded-lg border border-line px-5 font-semibold transition hover:border-brand hover:text-brand">
            Savol berish
          </Link>
        </div>
      </section>
    </main>
  );
}
