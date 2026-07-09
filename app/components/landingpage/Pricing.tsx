import { Check } from "lucide-react";
import SectionHead from "../ui/SectionHead";


export default function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "$0",
      per: "forever",
      desc: "For freelancers just getting started.",
      features: ["10 invoices / mo", "1 template", "Basic reports", "Email support"],
      highlight: false,
    },
    {
      name: "Pro",
      price: "$19",
      per: "/month",
      desc: "For growing businesses that need more.",
      features: [
        "Unlimited invoices",
        "All templates",
        "Excel export",
        "Payment reminders",
        "Priority support",
      ],
      highlight: true,
    },
    {
      name: "Business",
      price: "$49",
      per: "/month",
      desc: "For teams that bill at scale.",
      features: [
        "Everything in Pro",
        "Team seats",
        "Advanced analytics",
        "Custom branding",
        "Dedicated manager",
      ],
      highlight: false,
    },
  ];
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <SectionHead
        eyebrow="Pricing"
        title="Simple plans, no surprises"
        desc="Start free. Upgrade only when you need more power."
      />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 px-5 sm:px-8 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            data-reveal
            className={`reveal relative rounded-3xl border p-8 transition hover:-translate-y-1 ${
              t.highlight
                ? "border-transparent bg-gradient-to-br from-[#0B1B3B] to-[#bfda2b] text-white shadow-[0_30px_60px_-20px_rgba(11,27,59,0.5)]"
                : "border-emerald-100 bg-white shadow-[0_20px_50px_-30px_rgba(27,67,50,0.3)]"
            }`}
          >
            {t.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#2d6a4f] to-[#081c15] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                Most popular
              </span>
            )}
            <div className={`text-sm font-semibold ${t.highlight ? "text-emerald-200" : "text-[#1b4332]"}`}>
              {t.name}
            </div>
            <div className="mt-3 flex items-end gap-1">
              <span className="text-5xl font-extrabold">{t.price}</span>
              <span className={`pb-2 text-sm ${t.highlight ? "text-slate-300" : "text-slate-500"}`}>
                {t.per}
              </span>
            </div>
            <p className={`mt-3 text-sm ${t.highlight ? "text-slate-300" : "text-slate-600"}`}>
              {t.desc}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className={`h-4 w-4 ${t.highlight ? "text-[#2d6a4f]" : "text-[#1b4332]"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#"
              className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition ${
                t.highlight
                  ? "bg-gradient-to-r from-[#2d6a4f] to-[#081c15] text-white hover:-translate-y-0.5"
                  : "border border-slate-200 bg-white text-[#0B1B3B] hover:border-[#1b4332] hover:text-[#1b4332]"
              }`}
            >
              Get started
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
