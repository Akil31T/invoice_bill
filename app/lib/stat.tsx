export default function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-lg font-extrabold text-[#0B1B3B] sm:text-2xl">{value}</div>
      <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );
}