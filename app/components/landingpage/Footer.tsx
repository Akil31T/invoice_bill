import { Receipt } from "lucide-react";

export default function Footer() {
  const cols: [string, string[]][] = [
    ["Product", ["Features", "Pricing", "Templates", "Integrations"]],
    ["Company", ["About", "Careers", "Blog", "Press"]],
    ["Support", ["Help center", "Contact", "Status", "Community"]],
    ["Legal", ["Privacy", "Terms", "Security", "Cookies"]],
  ];
  return (
    <footer className="relative border-t border-emerald-100 bg-white/70 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 py-14 sm:grid-cols-3 sm:px-8 lg:grid-cols-6">
        <div className="col-span-2">
          <a href="#" className="flex items-center gap-2 font-extrabold text-xl">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#081c15] text-white shadow">
              <Receipt className="h-5 w-5" />
            </span>
            <span>Bill<span className="text-[#1b4332]">wave</span></span>
          </a>
          <p className="mt-4 max-w-sm text-sm text-slate-600">
            Invoice & billing management for modern businesses. Get paid faster with a workflow
            you'll actually enjoy.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-5 flex max-w-sm items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm"
          >
            <input
              type="email"
              placeholder="you@company.com"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400"
            />
            <button className="rounded-full bg-gradient-to-r from-[#2d6a4f] to-[#081c15] px-4 py-2 text-xs font-bold text-white shadow">
              Subscribe
            </button>
          </form>
          {/* <div className="mt-5 flex gap-3">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Twitter, label: "Twitter" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Github, label: "GitHub" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-0.5 hover:border-[#1b4332] hover:text-[#1b4332]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div> */}
        </div>
        {cols.map(([title, links]) => (
          <div key={title}>
            <div className="text-sm font-bold">{title}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="transition hover:text-[#1b4332]">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-emerald-100/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:px-8">
          <span>© 2026 Billwave, Inc. All rights reserved.</span>
          <span>Made with 🧡 for growing businesses.</span>
        </div>
      </div>
    </footer>
  );
}