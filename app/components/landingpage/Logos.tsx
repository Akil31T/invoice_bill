

export default function Logos() {
  const logos = ["Acme", "Vaultly", "Northwind", "Lumen", "Pixel Forge", "Kite & Co"];
  return (
     <section className="border-y border-emerald-100/60 bg-white/60 py-8 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
          Trusted by 10,000+ growing teams worldwide
        </p>
        <div className="mt-5 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((l) => (
            <div
              key={l}
              className="text-center text-lg font-extrabold tracking-tight text-slate-400 transition hover:text-[#1b4332]"
            >
              {l}.
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}