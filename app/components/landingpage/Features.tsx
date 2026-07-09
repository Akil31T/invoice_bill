import { BarChart3, Check, FileSpreadsheet, FileText, LayoutTemplate, Mail, Users } from "lucide-react";
import SectionHead from "../ui/SectionHead";


export default function Features() {
  const items = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Invoice Generator",
      desc: "Create branded invoices in seconds with GST, auto tax and multi-currency.",
      bullets: ["Instant PDF download", "GST & tax rules", "Multi-currency"],
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6" />,
      title: "Excel Export",
      desc: "Download financial, customer and sales reports as clean spreadsheets.",
      bullets: ["One-click export", "Financial reports", "Custom filters"],
    },
    {
      icon: <LayoutTemplate className="h-6 w-6" />,
      title: "Invoice Templates",
      desc: "Switch between beautiful, brandable layouts with your logo and colors.",
      bullets: ["5+ templates", "Logo upload", "Live preview"],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Customer Management",
      desc: "Track profiles, history, outstanding balances and personal notes.",
      bullets: ["Payment history", "Outstanding balance", "Customer notes"],
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Integration",
      desc: "Send invoices, reminders and thank-yous with tracked delivery.",
      bullets: ["Delivery tracking", "Auto reminders", "Custom templates"],
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      desc: "Live revenue, expenses and pending invoices — everything at a glance.",
      bullets: ["Revenue insights", "Paid vs pending", "Recent activity"],
    },
  ];

  return (
      <section id="features" className="relative py-24 sm:py-32">
      <SectionHead
        eyebrow="Features"
        title="Everything you need to bill clients"
        desc="A complete invoicing suite that replaces spreadsheets, PDFs and follow-up emails with one delightful workflow."
      />
      <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-6 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {items.map((f, i) => (
          <div
            key={f.title}
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
            className="group reveal relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-7 shadow-[0_20px_50px_-30px_rgba(27,67,50,0.25)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(27,67,50,0.35)]"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-100 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#081c15] text-white shadow-[0_10px_25px_-8px_rgba(27,67,50,0.7)]">
              {f.icon}
            </span>
            <h3 className="relative mt-5 text-lg font-bold">{f.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            <ul className="relative mt-5 space-y-2 text-sm">
              {f.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-[#1b4332]" /> {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}