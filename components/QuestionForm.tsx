"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { sendQuestion, type QuestionField, type QuestionState } from "@/app/actions";
import { maskPhone } from "@/lib/format";

const initialState: QuestionState = { status: "idle" };
const MAX_LENGTH = 2000;

/** FAQ sahifasidagi forma: savol adminga Telegram orqali boradi. */
export function QuestionForm() {
  const [state, formAction, pending] = useActionState(sendQuestion, initialState);
  const [phone, setPhone] = useState("+998 ");
  const [message, setMessage] = useState("");

  if (state.status === "success") {
    return (
      <div className="rounded-xl bg-ok-soft p-6 ring-1 ring-ok/25" role="status">
        <CheckCircle2 size={30} className="text-ok" aria-hidden />
        <p className="mt-3 text-lg font-bold text-ok">Savolingiz yuborildi</p>
        <p className="mt-1 text-sm text-ink/80">
          Rahmat, {state.fullName}. Administrator savolingizni oldi va tez orada siz bilan bog&apos;lanadi.
        </p>
      </div>
    );
  }

  const fieldErrors = state.status === "error" ? state.fieldErrors : {};
  const values = state.status === "error" ? state.values : {};
  const errorText = (field: QuestionField) =>
    fieldErrors[field] ? <span id={`${field}-error`} className="mt-1.5 block text-sm font-medium text-bad">{fieldErrors[field]}</span> : null;
  const inputClass = (field: QuestionField) =>
    `mt-1.5 w-full rounded-lg border bg-page px-3.5 text-base text-ink outline-none transition placeholder:text-faint focus:border-brand focus:ring-3 focus:ring-brand/15 ${
      fieldErrors[field] ? "border-bad" : "border-line"
    }`;
  const describedBy = (field: QuestionField) => (fieldErrors[field] ? `${field}-error` : undefined);

  return (
    <form action={formAction} className="grid gap-4">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg bg-bad-soft p-3 text-sm font-semibold text-bad ring-1 ring-bad/20">{state.message}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Ism familiya
          <input
            type="text" name="full_name" required minLength={3} maxLength={120} autoComplete="name"
            defaultValue={values.full_name} placeholder="Ism Familiya" className={`${inputClass("full_name")} h-12`}
            aria-invalid={Boolean(fieldErrors.full_name)} aria-describedby={describedBy("full_name")}
          />
          {errorText("full_name")}
        </label>
        <label className="text-sm font-semibold">
          Telefon raqam
          <input
            type="tel" name="phone" required autoComplete="tel" inputMode="tel"
            value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))}
            placeholder="+998 90 123 45 67" className={`${inputClass("phone")} h-12 tabular-nums tracking-wide`}
            aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={describedBy("phone")}
          />
          {errorText("phone")}
        </label>
      </div>
      <label className="text-sm font-semibold">
        Savolingiz
        <textarea
          name="message" required minLength={5} maxLength={MAX_LENGTH} rows={7}
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Savolingizni batafsil yozing…" className={`${inputClass("message")} resize-y py-3 leading-relaxed`}
          aria-invalid={Boolean(fieldErrors.message)} aria-describedby={describedBy("message")}
        />
        <span className="mt-1 flex justify-between text-xs font-normal text-muted">
          <span>{errorText("message")}</span>
          <span className="tabular-nums">{message.length} / {MAX_LENGTH}</span>
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 items-center justify-center gap-2 rounded-lg bg-brand font-bold text-on-brand transition hover:bg-brand-hover disabled:cursor-wait disabled:opacity-70 sm:w-fit sm:px-8"
      >
        <Send size={17} aria-hidden />
        {pending ? "Yuborilmoqda..." : "Savolni yuborish"}
      </button>
    </form>
  );
}
