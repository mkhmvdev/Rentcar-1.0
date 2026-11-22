export default function Loading() {
  return (
    <div className="container-shell py-16" aria-label="Sahifa yuklanmoqda">
      <div className="h-12 w-48 animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map((item) => (
          <div key={item} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
