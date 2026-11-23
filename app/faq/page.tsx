import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { getFaqs } from "@/lib/api";
import { QuestionForm } from "@/components/QuestionForm";

export const metadata: Metadata = {
  title: "Ko'p beriladigan savollar",
  description: "Avtomobil ijarasi bo'yicha savollarga javoblar. Javob topmasangiz, savolingizni yozib qoldiring.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <main className="container-shell max-w-3xl py-10">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ko&apos;p beriladigan savollar</h1>
      <p className="mt-2 text-muted">Javob topmasangiz, pastdagi forma orqali savolingizni yuboring.</p>

      {faqs.length > 0 && (
        <div className="mt-8 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {faqs.map((faq, index) => (
            <details key={faq.id} className="group" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold transition hover:text-brand [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown size={18} className="shrink-0 text-muted transition group-open:rotate-180 group-open:text-brand" aria-hidden />
              </summary>
              <p className="-mt-1 whitespace-pre-line px-5 pb-5 leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      )}

      <section id="savol" className="mt-12 scroll-mt-24 rounded-xl border border-line bg-surface p-5 sm:p-7">
        <h2 className="text-xl font-bold">Savolingiz bormi?</h2>
        <p className="mt-1 text-sm text-muted">Savolingiz administratorga Telegram orqali yetkaziladi va u siz bilan bog&apos;lanadi.</p>
        <div className="mt-6">
          <QuestionForm />
        </div>
      </section>
    </main>
  );
}
