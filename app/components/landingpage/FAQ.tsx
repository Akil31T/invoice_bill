"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SectionHead from "../ui/SectionHead";


export default function FAQ() {
  const qs = [
    ["Can I export to Excel?", "Yes — every table, filter and view exports as a clean spreadsheet with one click."],
    ["Can I customize invoice templates?", "Absolutely. Pick any layout and drop in your logo, colors and business details."],
    ["Can I send invoices via email?", "Send invoices directly from Billwave with delivery tracking and auto reminders."],
    ["Is GST supported?", "GST, VAT and custom tax rules are supported out of the box for multi-region billing."],
    ["Can I track payments?", "Track paid, pending and overdue invoices in real time with a live payment dashboard."],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <SectionHead eyebrow="FAQ" title="Frequently asked questions" desc="Everything you need to know before signing up." />
      <div className="mx-auto mt-12 max-w-3xl px-5 sm:px-8">
        {qs.map(([q, a], i) => (
          <div
            key={q}
            data-reveal
            className="reveal mb-3 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold sm:text-base">{q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#1b4332] transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300"
              style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
