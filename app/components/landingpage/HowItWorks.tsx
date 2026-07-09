import { ArrowRight } from "lucide-react";
import SectionHead from "../ui/SectionHead";


export default function HowItWorks() {
  const steps = [
    { t: "Add Customer", d: "Import contacts or add clients in one click." },
    { t: "Create Invoice", d: "Line items, taxes and discounts, auto-calculated." },
    { t: "Customize Template", d: "Pick a layout and drop in your logo & colors." },
    { t: "Send Email", d: "Deliver invoices with tracked links & reminders." },
    { t: "Receive Payment", d: "Accept cards, UPI or bank transfer securely." },
    { t: "Export Excel", d: "Ship reports to accounting in one click." },
  ];
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/2 bg-gradient-to-r from-emerald-50 via-transparent to-emerald-50" />
      <SectionHead
        eyebrow="How it works"
        title="From customer to cash in 6 steps"
        desc="A guided workflow your whole team can master in one afternoon."
      />
      <div className="mx-auto mt-14 max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.t}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              className="reveal group relative rounded-3xl border border-emerald-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="mb-4 inline-grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#081c15] text-sm font-extrabold text-white shadow-[0_10px_20px_-6px_rgba(27,67,50,0.7)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-bold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{s.d}</p>
              <ArrowRight className="mt-4 h-4 w-4 text-[#1b4332] transition group-hover:translate-x-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}