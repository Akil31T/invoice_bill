

import { useEffect, useRef, useState } from "react";
import {
  FileSpreadsheet,
  Mail,
  BarChart3,
  Check,
  ArrowRight,
  Play,
  Sparkles,
  Coins,
  Bell,
} from "lucide-react";
import useCounter from "@/app/hooks/useCounter";
import Stat from "../../lib/stat";
import FloatCard from "../../lib/FloatCard";
import FloatIcon from "@/app/lib/FloatIcon";

export default function Hero() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), {
      threshold: 0.3,
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const revenue = useCounter(48920, inView);
  const invoices = useCounter(1284, inView);

  return (
     <section className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-40">
      {/* blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full bg-[#1b4332]/15 blur-3xl animate-[blob_18s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -top-10 right-0 h-[420px] w-[420px] rounded-full bg-[#2d6a4f]/20 blur-3xl animate-[blob_22s_ease-in-out_infinite_reverse]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-24 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pb-32">
        {/* copy */}
        <div className="animate-[fadeInUp_.9s_ease-out_both]">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#1b4332] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> New — AI invoice assistant
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Create <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#2d6a4f] to-[#081c15] bg-clip-text text-transparent">
                Professional
              </span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-emerald-100" />
            </span>{" "}
            Invoices in Seconds
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Manage invoices, customers, payments, taxes and reports from one powerful
            dashboard. Export data to Excel, customize templates and grow your business
            effortlessly.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/auth"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2d6a4f] to-[#081c15] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(27,67,50,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-12px_rgba(27,67,50,0.9)]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1b4332] hover:text-[#1b4332]"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-[#1b4332]">
                <Play className="h-3 w-3 fill-current" />
              </span>
              Watch Demo
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
            {["No credit card required", "Free forever plan", "10,000+ businesses"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" /> {b}
              </span>
            ))}
          </div>

          {/* counters */}
          <div ref={ref} className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
            <Stat label="Revenue tracked" value={`$${revenue.toLocaleString()}`} />
            <Stat label="Invoices sent" value={invoices.toLocaleString()} />
            <Stat label="Avg. rating" value="4.9★" />
          </div>
        </div>

        {/* illustration */}
<div className="relative animate-[fadeInUp_1s_ease-out_.15s_both]">
  <div className="relative mx-auto aspect-square max-w-lg">

    {/* backdrop */}
    <div className="absolute inset-6 rounded-[36px] bg-gradient-to-br from-white to-emerald-50 shadow-[0_40px_80px_-30px_rgba(27,67,50,0.35)] ring-1 ring-emerald-100" />

    {/* Centered Hero Image */}
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <img
        src="/2.png"
        alt="Freelancer creating invoices"
        className="h-[360px] w-[360px] object-contain animate-[floatY_6s_ease-in-out_infinite] drop-shadow-2xl"
      />
    </div>

    {/* Floating Cards */}
    <FloatCard
      className="absolute left-0 top-10 z-20 animate-[floatY_5s_ease-in-out_infinite]"
      icon={<Check className="h-4 w-4" />}
      iconBg="bg-emerald-500"
      title="Invoice Paid"
      sub="$2,480 · INV-1042"
    />

    <FloatCard
      className="absolute right-0 top-32 z-20 animate-[floatY_7s_ease-in-out_infinite_reverse]"
      icon={<Mail className="h-4 w-4" />}
      iconBg="bg-[#1b4332]"
      title="Email sent"
      sub="Client received invoice"
    />

    <FloatCard
      className="absolute bottom-0 left-6 z-20 animate-[floatY_6s_ease-in-out_infinite_.5s]"
      icon={<BarChart3 className="h-4 w-4" />}
      iconBg="bg-indigo-500"
      title="Revenue +38%"
      sub="This month vs last"
    />

    {/* Icons */}
    <FloatIcon
      className="left-4 top-4"
      bg="bg-emerald-100"
      color="text-[#1b4332]"
    >
      <Coins className="h-5 w-5" />
    </FloatIcon>

    <FloatIcon
      className="right-6 bottom-14"
      bg="bg-indigo-100"
      color="text-indigo-600"
    >
      <Bell className="h-5 w-5" />
    </FloatIcon>

    <FloatIcon
      className="right-16 top-2"
      bg="bg-emerald-100"
      color="text-emerald-600"
    >
      <FileSpreadsheet className="h-5 w-5" />
    </FloatIcon>

  </div>
</div>
      </div>
    </section>
  );
}