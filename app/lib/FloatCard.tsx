

export default function FloatCard({
  className,
  icon,
  iconBg,
  title,
  sub,
}: {
  className?: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
}) {
  return (
   <div
      className={`z-20 flex items-center gap-3 rounded-2xl bg-white/90 px-3.5 py-2.5 shadow-[0_20px_40px_-15px_rgba(11,27,59,0.25)] ring-1 ring-white backdrop-blur ${className ?? ""}`}
    >
      <span className={`grid h-8 w-8 place-items-center rounded-xl text-white ${iconBg}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-[#0B1B3B]">{title}</div>
        <div className="truncate text-[11px] text-slate-500">{sub}</div>
      </div>
    </div>
  );
}