import { Bell, Cloud, Palette, Rocket, Zap } from "lucide-react";
import SectionHead from "../ui/SectionHead";


export default function Upcoming() {
  const items = [
    {
      icon: Palette,
      tag: "Coming Soon",
      title: "Custom Excel Export Templates",
      desc: "Design your own Excel layouts — pick columns, add formulas, brand headers and reuse across exports.",
    },
    {
      icon: Zap,
      tag: "In Beta",
      title: "Bulk Share to WhatsApp",
      desc: "Send monthly invoices to 100+ clients on WhatsApp in a single click, with delivery status.",
    },
    {
      icon: Cloud,
      tag: "Q3 2026",
      title: "Auto-Backup to Google Drive",
      desc: "Every invoice PDF & Excel report auto-synced to your Drive folder in real time.",
    },
    {
      icon: Bell,
      tag: "Q4 2026",
      title: "Smart Payment Reminders",
      desc: "AI-timed reminders on Email + WhatsApp to nudge clients — without being annoying.",
    },
  ];

  return (
   <section className="relative overflow-hidden bg-gradient-to-b from-[#e6f2eb] via-[#f0f7f3] to-white py-24 sm:py-32">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#1b4332]/15 blur-3xl animate-[blob_22s_ease-in-out_infinite]" />
      <SectionHead
        eyebrow="What's Next"
        title="Upcoming features on the roadmap"
        desc="We ship fast. Here's a peek at what's landing next in Billwave."
      />

      <div className="mx-auto mt-14 grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        {/* roadmap list */}
        <ol className="relative space-y-6 border-l-2 border-dashed border-emerald-200 pl-6 sm:pl-8">
          {items.map((it, i) => (
            <li
              key={it.title}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
              className="relative"
            >
              <span className="absolute -left-[34px] sm:-left-[42px] top-1 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#081c15] text-white shadow-[0_8px_20px_-4px_rgba(27,67,50,0.55)] animate-[pulseRing_2.4s_ease-in-out_infinite]">
                <it.icon className="h-4 w-4" />
              </span>
              <div className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#1b4332]">
                    {it.tag}
                  </span>
                  <h3 className="text-base font-bold">{it.title}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600">{it.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* rocket illustration */}
        <div className="relative mx-auto aspect-square w-full max-w-md" data-reveal>
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <defs>
              <linearGradient id="rktBody" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#fff" />
                <stop offset="1" stopColor="#b7e4c7" />
              </linearGradient>
              <linearGradient id="rktFire" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#2d6a4f" />
                <stop offset="1" stopColor="#081c15" />
              </linearGradient>
            </defs>
            {/* stars */}
            {[
              [50, 60],
              [340, 80],
              [80, 300],
              [330, 300],
              [200, 40],
              [370, 220],
              [40, 180],
            ].map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#1b4332"
                opacity="0.7"
                style={{ animation: `twinkle ${1.6 + (i % 4) * 0.4}s ease-in-out infinite` }}
              />
            ))}
            {/* orbit */}
            <ellipse cx="200" cy="220" rx="150" ry="40" fill="none" stroke="#95d5b2" strokeDasharray="4 6" />
            {/* rocket */}
            <g style={{ transformOrigin: "200px 200px", animation: "floatY 4s ease-in-out infinite" }}>
              {/* fire */}
              <g style={{ transformOrigin: "200px 290px", animation: "flame 0.5s ease-in-out infinite alternate" }}>
                <path d="M180,280 Q200,340 220,280 Q210,310 200,320 Q190,310 180,280 Z" fill="url(#rktFire)" />
              </g>
              {/* body */}
              <path d="M200,90 Q240,140 240,220 Q240,270 200,290 Q160,270 160,220 Q160,140 200,90 Z" fill="url(#rktBody)" stroke="#95d5b2" strokeWidth="2" />
              <circle cx="200" cy="180" r="18" fill="#1b4332" />
              <circle cx="200" cy="180" r="10" fill="#fff" />
              {/* fins */}
              <path d="M160,230 L130,280 L160,270 Z" fill="#1b4332" />
              <path d="M240,230 L270,280 L240,270 Z" fill="#1b4332" />
            </g>
            {/* floating badge */}
            <g style={{ animation: "floatY 3.5s ease-in-out infinite reverse" }}>
              <rect x="280" y="120" width="90" height="34" rx="17" fill="#fff" stroke="#95d5b2" />
              <circle cx="298" cy="137" r="6" fill="#1b4332" />
              <text x="312" y="141" fontSize="11" fontWeight="700" fill="#0B1B3B">Ship Weekly</text>
            </g>
          </svg>
          <div className="absolute inset-x-0 -bottom-2 mx-auto flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-bold text-[#1b4332] shadow">
            <Rocket className="h-4 w-4" /> New features every month
          </div>
        </div>
      </div>
    </section>
  );
}