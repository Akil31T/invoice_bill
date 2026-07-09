'use client';

import { Check, FileSpreadsheet } from "lucide-react";
import { useState } from "react";


export default function ExcelShowcase() {
  const [exported, setExported] = useState(false);
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div data-reveal className="reveal">
          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Excel Export
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ship reports to accounting in one click
          </h2>
          <p className="mt-3 max-w-lg text-slate-600">
            Every table, filter and view in Billwave downloads as a clean, formatted
            spreadsheet. No copy-paste, no reformatting.
          </p>
          <button
            onClick={() => {
              setExported(false);
              setTimeout(() => setExported(true), 40);
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_-10px_rgba(5,150,105,0.6)] transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            <FileSpreadsheet className="h-4 w-4" /> Export to Excel
          </button>
        </div>

        <div data-reveal className="reveal relative">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs font-medium text-slate-500">invoices.xlsx</span>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-emerald-50 text-emerald-800">
                <tr>
                  {["Invoice", "Customer", "Date", "Status", "Amount"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["INV-1041", "Acme Corp", "Nov 21", "Paid", "$3,960"],
                  ["INV-1042", "Northwind", "Nov 22", "Paid", "$1,240"],
                  ["INV-1043", "Lumen", "Nov 23", "Pending", "$820"],
                  ["INV-1044", "Kite & Co", "Nov 24", "Paid", "$2,110"],
                  ["INV-1045", "Vaultly", "Nov 25", "Overdue", "$540"],
                ].map((r, i) => (
                  <tr
                    key={r[0]}
                    className="transition"
                    style={{
                      background: exported ? "rgba(16,185,129,0.06)" : "transparent",
                      transitionDelay: `${i * 80}ms`,
                    }}
                  >
                    {r.map((c, ci) => (
                      <td key={ci} className="px-3 py-2.5">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {exported && (
            <div className="pointer-events-none absolute -right-4 -top-4 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg animate-[fadeInUp_.4s_ease-out]">
              <Check className="h-4 w-4" /> Downloaded
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
