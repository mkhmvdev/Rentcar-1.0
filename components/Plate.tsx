/** O'zbekiston davlat raqami ko'rinishidagi belgi: | 01 | A 123 BC | UZ | */
export function Plate({ number, size = "md" }: { number: string; size?: "sm" | "md" | "lg" }) {
  const [region, ...rest] = number.split(" ");
  const sizes = {
    sm: "h-7 text-[15px] gap-1.5 px-1.5",
    md: "h-9 text-[19px] gap-2 px-2",
    lg: "h-12 text-[26px] gap-2.5 px-2.5",
  }[size];
  return (
    <span
      className={`inline-flex items-center rounded-[5px] border-2 border-[#111] bg-[#f7f7f2] font-plate font-bold uppercase leading-none tracking-wide text-[#111] shadow-[0_2px_0_rgb(0_0_0/0.4)] ${sizes}`}
      aria-label={`Davlat raqami ${number}`}
    >
      <span className="pr-1.5">{region}</span>
      <span className="h-[70%] w-[2px] bg-[#111]" aria-hidden />
      <span className="whitespace-nowrap">{rest.join(" ")}</span>
      <span className="ml-0.5 flex flex-col items-center gap-[2px]" aria-hidden>
        <span className="flex h-[9px] w-[13px] flex-col overflow-hidden rounded-[1px]">
          <span className="flex-1 bg-[#1eb5e8]" />
          <span className="h-px bg-[#d22]" />
          <span className="flex-1 bg-white" />
          <span className="h-px bg-[#d22]" />
          <span className="flex-1 bg-[#1eb53a]" />
        </span>
        <span className="font-sans text-[8px] font-extrabold leading-none text-[#1e5bb5]">UZ</span>
      </span>
    </span>
  );
}
