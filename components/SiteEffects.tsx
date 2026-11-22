"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Moon, Sun } from "lucide-react";

export function SiteEffects() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
      setVisible(window.scrollY > 500);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <div className="fixed left-0 top-0 z-[100] h-1 bg-[#3563E9]" style={{ width: `${progress}%` }} />
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <button type="button" onClick={() => setDark((value) => !value)} aria-label={dark ? "Yorqin rejim" : "Qorong‘i rejim"} className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg">
          {dark ? <Sun size={18}/> : <Moon size={18}/>}
        </button>
        {visible && <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Sahifa boshiga qaytish" className="grid size-11 place-items-center rounded-full bg-[#3563E9] text-white shadow-lg"><ArrowUp size={18}/></button>}
      </div>
    </>
  );
}
