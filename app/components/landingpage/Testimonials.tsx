import { Star } from "lucide-react";
import SectionHead from "../ui/SectionHead";


export default 
function Testimonials() {
  const items = [
    {
      name: "Ava Chen",
      role: "Freelance Designer",
      quote:
        "Billwave saved me hours every week. The Excel export and email features are amazing.",
    },
    {
      name: "Marcus Rivera",
      role: "Agency Founder",
      quote:
        "Template customization makes my invoices look incredibly professional. Clients notice.",
    },
    {
      name: "Priya Shah",
      role: "Accountant",
      quote:
        "The UI is beautiful and everything is so easy to use. My clients moved off spreadsheets.",
    },
    {
      name: "Leo Fischer",
      role: "SaaS Founder",
      quote:
        "Fastest invoicing tool I've tried — reminders, tracking and payments all in one place.",
    },
  ];
  const doubled = [...items, ...items];
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <SectionHead
        eyebrow="Loved by customers"
        title="What people say about Billwave"
        desc="Join thousands of businesses that get paid faster with less hassle."
      />
      <div className="mt-14 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max gap-5 px-5 animate-[marquee_35s_linear_infinite]">
          {doubled.map((t, i) => (
            <figure
              key={i}
              className="w-[320px] shrink-0 rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_20px_40px_-25px_rgba(27,67,50,0.35)]"
            >
              <div className="flex gap-0.5 text-[#1b4332]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, #2d6a4f, #081c15)`,
                  }}
                >
                  {t.name[0]}
                </span>
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}