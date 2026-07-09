

import { ArrowRight, Menu, Receipt, X } from "lucide-react";


export default function Nav({
  scrolled,
  menu,
  setMenu,
}: {
  scrolled: boolean;
  menu: boolean;
  setMenu: (b: boolean) => void;
}) {
  const links = ["Features", "How it works", "Templates", "Pricing", "FAQ"];
  return (
<header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "backdrop-blur-xl bg-white/70 shadow-[0_8px_30px_-12px_rgba(11,27,59,0.15)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#" className="flex items-center gap-2 font-extrabold text-xl">
          {/* <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#081c15] text-white shadow-[0_8px_20px_-6px_rgba(27,67,50,0.6)]">
            <Receipt className="h-5 w-5" />
          </span> */}
             <img
                src='/min-logo.png'
                alt="Budget management illustration"
                width={104}
                height={104}
                className="w-10 max-w-xs sm:max-w-sm lg:max-w-md"
              />
          <span>Invoice<span className="text-[#1b4332]">Bill</span></span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative text-sm font-medium text-slate-600 transition hover:text-[#1b4332] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#1b4332] after:transition-all hover:after:w-full"
            >
              {l}
            </a>
          ))}
        </nav>
{/* login */}
        <div className="hidden items-center gap-3 md:flex">
          <a href="/auth" className="text-sm font-medium text-slate-600 hover:text-[#1b4332]">
            Sign in
          </a>
          {/* register */}
          <a
            href="/auth" 
            className="group rounded-full bg-gradient-to-r from-[#2d6a4f] to-[#081c15] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(27,67,50,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(27,67,50,0.9)]"
          >
            Get Started
            <ArrowRight className="ml-1 inline h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          onClick={() => setMenu(!menu)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white md:hidden"
          aria-label="Menu"
        >
          {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menu && (
        <div className="border-t border-slate-100 bg-white/95 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMenu(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-[#1b4332]"
              >
                {l}
              </a>
            ))}
            <a
              href="/auth"
              className="mt-2 rounded-full bg-gradient-to-r from-[#2d6a4f] to-[#081c15] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Get Started Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}