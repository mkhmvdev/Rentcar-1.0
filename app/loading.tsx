export default function Loading() {
  return (
    <main className="container-shell py-10" aria-busy="true" aria-label="Yuklanmoqda">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    </main>
  );
}
