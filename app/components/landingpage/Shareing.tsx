import { Download, Mail, MessageCircle, Send, Share2 } from "lucide-react";
import SectionHead from "../ui/SectionHead";


export default function Sharing() {
  const channels = [
    {
      icon: Mail,
      title: "Email",
      desc: "Send branded PDF invoices with one click. Auto-attach and track opens.",
      color: "from-[#FF9A3D] to-[#FF4D00]",
      accent: "bg-orange-50 text-[#FF7A00]",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      desc: "Share invoice PDFs directly on WhatsApp with a pre-filled message.",
      color: "from-[#25D366] to-[#128C7E]",
      accent: "bg-green-50 text-[#128C7E]",
    },
    {
      icon: Download,
      title: "PDF Download",
      desc: "Pixel-perfect PDFs, print-ready and mobile-friendly, in a tap.",
      color: "from-[#0B1B3B] to-[#334E86]",
      accent: "bg-slate-100 text-[#0B1B3B]",
    },
    {
      icon: Send,
      title: "Direct Link",
      desc: "Copy a secure share link — client can view & pay from any device.",
      color: "from-[#FF7A00] to-[#FF4D00]",
      accent: "bg-orange-50 text-[#FF7A00]",
    },
  ];

  return (
 <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#1b4332]/10 blur-3xl animate-[blob_20s_ease-in-out_infinite]" />
      <SectionHead
        eyebrow="Share Anywhere"
        title="Share invoices via Email, WhatsApp & PDF"
        desc="Meet your customers where they are. Deliver invoices instantly across every channel they use."
      />

      <div className="mx-auto mt-14 grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        {/* illustration */}
        <div className="relative order-2 lg:order-1" data-reveal>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {/* animated share illustration (SVG) */}
            <svg viewBox="0 0 400 400" className="h-full w-full">
              <defs>
                <linearGradient id="paperGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="1" stopColor="#d8f3dc" />
                </linearGradient>
                <linearGradient id="orangeGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#2d6a4f" />
                  <stop offset="1" stopColor="#081c15" />
                </linearGradient>
              </defs>
              {/* backdrop circle */}
              <circle cx="200" cy="200" r="170" fill="#d8f3dc" opacity="0.6" />
              <circle cx="200" cy="200" r="130" fill="#fff" opacity="0.9" />
              {/* invoice paper */}
              <g style={{ transformOrigin: "200px 200px", animation: "floatY 4.5s ease-in-out infinite" }}>
                <rect x="130" y="120" width="140" height="180" rx="14" fill="url(#paperGrad)" stroke="#95d5b2" />
                <rect x="146" y="140" width="70" height="10" rx="3" fill="url(#orangeGrad)" />
                <rect x="146" y="160" width="108" height="6" rx="2" fill="#E9D6C2" />
                <rect x="146" y="176" width="90" height="6" rx="2" fill="#E9D6C2" />
                <rect x="146" y="200" width="108" height="6" rx="2" fill="#F0E1CE" />
                <rect x="146" y="214" width="70" height="6" rx="2" fill="#F0E1CE" />
                <rect x="146" y="228" width="94" height="6" rx="2" fill="#F0E1CE" />
                <rect x="146" y="260" width="60" height="24" rx="6" fill="url(#orangeGrad)" />
              </g>
              {/* orbiting share bubbles */}
              <g style={{ transformOrigin: "200px 200px", animation: "spinSlow 18s linear infinite" }}>
                <g transform="translate(60,110)">
                  <circle r="26" fill="#1b4332" />
                  <text x="0" y="6" textAnchor="middle" fontSize="22" fill="#fff" fontWeight="700">@</text>
                </g>
                <g transform="translate(340,150)">
                  <circle r="26" fill="#25D366" />
                  <path d="M-8,-6 q0,-10 10,-10 q10,0 10,10 q0,10 -10,10 l-4,4 v-4 q-6,0 -6,-10z" fill="#fff" />
                </g>
                <g transform="translate(320,320)">
                  <circle r="26" fill="#0B1B3B" />
                  <path d="M-7,-8 h14 v10 h5 l-12,10 l-12,-10 h5 z" fill="#fff" />
                </g>
                <g transform="translate(70,320)">
                  <circle r="26" fill="#081c15" />
                  <path d="M-10,0 l16,-8 v6 h6 v4 h-6 v6 z" fill="#fff" />
                </g>
              </g>
              {/* connecting dashed lines */}
              <g stroke="#95d5b2" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.7">
                <path d="M200,200 L60,110" />
                <path d="M200,200 L340,150" />
                <path d="M200,200 L320,320" />
                <path d="M200,200 L70,320" />
              </g>
            </svg>
          </div>
        </div>

        {/* channel cards */}
        <div className="order-1 grid gap-4 sm:grid-cols-2 lg:order-2">
          {channels.map((c, i) => (
            <div
              key={c.title}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-[0_10px_30px_-12px_rgba(11,27,59,0.10)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-14px_rgba(27,67,50,0.35)]"
            >
              <div
                className={`inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-lg transition group-hover:scale-110`}
              >
                <c.icon className="h-6 w-6" />
              </div>
              <div className="mt-4 text-lg font-bold">{c.title}</div>
              <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
              <div
                className={`mt-4 inline-flex items-center gap-1 rounded-full ${c.accent} px-3 py-1 text-xs font-bold`}
              >
                <Share2 className="h-3 w-3" /> One tap share
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}