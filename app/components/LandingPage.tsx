
'use client';
import { useEffect, useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  LayoutTemplate,
  Users,
  Mail,
  BarChart3,
  Check,
  ChevronDown,
  Star,
  ArrowRight,
  Receipt,
  ArrowUp,
} from "lucide-react";
import useReveal from "../hooks/useReveal";
import Nav from "./landingpage/nav";
import Hero from "./landingpage/hero";
import Sharing from "./landingpage/Shareing";
import Upcoming from "./landingpage/upcoming";
import Logos from "./landingpage/Logos";
import Features from "./landingpage/Features";
import HowItWorks from "./landingpage/HowItWorks";
import Templates from "./landingpage/Templates";
import ExcelShowcase from "./landingpage/ExcelShowcase";
import Testimonials from "./landingpage/Testimonials";
import FAQ from "./landingpage/FAQ";
import Pricing from "./landingpage/Pricing";
import FinalCTA from "./landingpage/FinalCTA";
import Footer from "./landingpage/Footer";


export default function LandingPage() {
  useReveal();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.3 });

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setProgress(p * 100);
      setScrolled(h.scrollTop > 20);
      setShowTop(h.scrollTop > 600);
    };
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f0f7f3] font-[Inter,system-ui,sans-serif] text-[#0B1B3B] antialiased">
      {/* scroll progress */}
      <div
        className="fixed left-0 top-0 z-[60] h-1 bg-gradient-to-r from-[#2d6a4f] via-[#1b4332] to-[#081c15] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />

      {/* mouse-follow gradient */}
   <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-60 [transition:background_.4s_ease]"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(27,67,50,0.10), transparent 60%)`,
        }}
      />

      <Nav scrolled={scrolled} menu={menu} setMenu={setMenu} />

      <main className="relative z-10">
        <Hero />
        <Logos />
        <Features />
        <HowItWorks />
        <Templates />
        <ExcelShowcase />
        <Sharing />
        <Upcoming />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />

      {/* back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full bg-[#1b4332] text-white shadow-[0_10px_25px_-6px_rgba(27,67,50,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-6px_rgba(27,67,50,0.7)] ${
          showTop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <StyleTag />
    </div>
  );
}


function StyleTag() {
  return (
    <style>{`
      @keyframes fadeInUp { from { opacity:0; transform: translateY(24px);} to { opacity:1; transform:none;} }
      @keyframes floatY { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-14px);} }
      @keyframes blob {
        0%,100% { transform: translate(0,0) scale(1);}
        33% { transform: translate(30px,-20px) scale(1.08);}
        66% { transform: translate(-20px,30px) scale(0.95);}
      }
      @keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }
      [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
      [data-reveal].reveal-in { opacity: 1; transform: none; }
      html { scroll-behavior: smooth; }
    `}</style>
  );
}
