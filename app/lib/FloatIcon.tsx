

export default function FloatIcon({
  children,
  className,
  bg,
  color,
}: {
  children: React.ReactNode;
  className?: string;
  bg: string;
  color: string;
}) {
  return (
     <span
      className={`absolute z-20 grid h-10 w-10 place-items-center rounded-2xl shadow-lg ring-1 ring-white ${bg} ${color} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
