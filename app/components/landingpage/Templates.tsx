'use client';
import { Check, Receipt } from "lucide-react";
import SectionHead from "../ui/SectionHead";
import { useState } from "react";

export default function Templates() {
  const templates = [
    { name: "Classic", accent: "#0B1B3B" },
    { name: "Modern", accent: "#1b4332" },
    { name: "Minimal", accent: "#334155" },
    { name: "Business", accent: "#4F46E5" },
    { name: "Corporate", accent: "#059669" },
  ];
  const [active, setActive] = useState(1);
  const t = templates[active];

  return (
    <section id="templates" className="relative py-24 sm:py-32">
      <SectionHead
        eyebrow="Templates"
        title="Beautiful invoice designs, in your brand"
        desc="Switch layouts live — your logo, colors and content stay in place."
      />

      <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        {/* preview */}
        <div data-reveal className="reveal relative order-2 lg:order-1">
          <div className="absolute -inset-4 -z-10 rounded-[40px] bg-gradient-to-br from-emerald-100 to-transparent blur-2xl" />
          <div
            key={active}
            className="animate-[fadeInUp_.5s_ease-out_both] rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <div
                  className="text-xl font-extrabold"
                  style={{ color: t.accent }}
                >
                  INVOICE
                </div>
                <div className="mt-1 text-xs text-slate-500">#INV-2024-0132</div>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: t.accent }}>
                <Receipt className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold text-slate-500">Billed to</div>
                <div className="mt-1 font-bold">Acme Corp.</div>
                <div className="text-slate-500">acme@example.com</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-slate-500">Due</div>
                <div className="mt-1 font-bold">Nov 30, 2026</div>
              </div>
            </div>
            <table className="mt-6 w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="pb-2 font-semibold">Item</th>
                  <th className="pb-2 text-right font-semibold">Qty</th>
                  <th className="pb-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Website design", 1, "$1,800"],
                  ["Brand system", 1, "$1,200"],
                  ["Consulting hours", 8, "$960"],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td className="py-2 font-medium">{r[0]}</td>
                    <td className="py-2 text-right">{r[1]}</td>
                    <td className="py-2 text-right font-semibold">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 flex justify-end">
              <div
                className="rounded-2xl px-5 py-3 text-right text-white"
                style={{ background: t.accent }}
              >
                <div className="text-[10px] uppercase opacity-80">Total due</div>
                <div className="text-2xl font-extrabold">$3,960.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* selector */}
        <div className="order-1 lg:order-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {templates.map((tp, i) => {
              const on = active === i;
              return (
                <button
                  key={tp.name}
                  onClick={() => setActive(i)}
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                    on
                      ? "border-[#1b4332] bg-white shadow-[0_15px_35px_-15px_rgba(27,67,50,0.5)]"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-200"
                  }`}
                >
                  <div
                    className="h-14 rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${tp.accent}, ${tp.accent}bb)` }}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold">{tp.name}</span>
                    {on && (
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1b4332] text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-slate-600">
            Click any template to preview it live. Your data instantly re-renders — no
            duplicate work, no export.
          </p>
        </div>
      </div>
    </section>
  );
}
