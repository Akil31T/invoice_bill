

export default function SectionHead({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 text-center sm:px-8" data-reveal>
      <span className="reveal inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#FF7A00]">
        {eyebrow}
      </span>
      <h2 className="reveal mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      <p className="reveal mt-3 text-slate-600">{desc}</p>
    </div>
  );
}
