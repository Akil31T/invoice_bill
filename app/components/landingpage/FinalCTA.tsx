import { ArrowRight } from "lucide-react";


export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br from-[#2d6a4f] via-[#1b4332] to-[#081c15] px-6 py-16 text-center text-white shadow-[0_40px_80px_-30px_rgba(27,67,50,0.6)] sm:px-16 sm:py-20">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <img
          src="/dashboard-preview.png"
          alt=""
          aria-hidden
          loading="lazy"
          width={1024}
          height={1024}
          className="pointer-events-none absolute -right-24 -top-10 hidden w-96 rotate-6 opacity-20 md:block"
        />

        <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-5xl">
          Start creating professional invoices today
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/90">
          Join 10,000+ businesses billing smarter with Billwave. Free forever plan — no credit
          card required.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#081c15] shadow-lg transition hover:-translate-y-0.5"
          >
            Start Free <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
          >
            Book Demo
          </a>
        </div>
      </div>
    </section>
  );
}
