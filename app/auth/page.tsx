"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Sparkles, Lock, Building2 } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Image from "next/image";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import { toast } from "sonner";
import { InputField } from "../components/ui/input-field";

export default function AuthPage() {
  const { user, loading } = useAuth();

  const router = useRouter();

  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [companyName, setCompanyName] = useState("");

  const [mode, setMode] = useState<"signin" | "forgot">("signin");

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const logActivity = async (event: string) => {
    try {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        await supabase.from("login_activity").insert({
          user_id: data.user.id,
          event,
          user_agent: navigator.userAgent,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setBusy(true);

      const { data: loginData, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        return toast.error(error.message);
      }

      const user = loginData.user;

      const { data: isActive, error: activeError } =
        await supabase.rpc("is_user_active", {
          uid: user.id,
        });

      if (activeError) {
        await supabase.auth.signOut();

        return toast.error(activeError.message);
      }

      if (!isActive) {
        await supabase.auth.signOut();

        return toast.error("Your account has been deactivated");
      }

      await logActivity("sign_in");

      toast.success("Login successful");

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);

      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setBusy(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            company_name: companyName || "My Company",
          },
        },
      });

      if (error) {
        return toast.error(error.message);
      }

      toast.success("Account created successfully");

      await logActivity("sign_up");

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);

      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    try {
      setBusy(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return toast.error(error.message);
      }
    } catch (err: any) {
      console.error(err);

      toast.error(err.message || "Google login failed");
    } finally {
      setBusy(false);
    }
  };

  const onForgot = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setBusy(true);

      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        return toast.error(error.message);
      }

      toast.success("Password reset link sent");

      setMode("signin");
    } catch (err: any) {
      console.error(err);

      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-green-100 font-sans text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-full flex-col lg:flex-row">
        {/* Left / Illustration panel */}
        <section className="relative overflow-hidden lg:w-1/2">
          {/* Orange blob background */}
          <div className="absolute inset-0 -z-0">
            <svg
              viewBox="0 0 600 800"
              preserveAspectRatio="none"
              className="h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="blob" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#9eeab2" />
                  <stop offset="100%" stopColor="#8bb5a8" />
                </linearGradient>
              </defs>
              <path
                fill="url(#blob)"
                d="M0,0 L520,0 C560,180 600,320 540,470 C480,620 380,700 260,760 C160,810 60,800 0,780 Z"
              />
            </svg>
          </div>

          <div className="relative z-10 flex min-h-[420px] flex-col px-6 py-8 sm:px-10 lg:min-h-screen lg:px-14 lg:py-12">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-[fadeInDown_0.7s_ease-out_both]">
              <img
                src="/logo.png"
                alt="InvoiceBill Logo"
                  width={1024}
                height={1024}
                className="w-full max-w-xs object-contain"
              />

            </div>

            {/* Illustration */}
            <div className="flex flex-1 items-center justify-center py-6">
              <img
                src='/3.png'
                alt="Budget management illustration"
                width={1024}
                height={1024}
                className="w-full max-w-xs animate-[floatY_5s_ease-in-out_infinite] drop-shadow-xl sm:max-w-sm lg:max-w-md"
              />
            </div>
          </div>
        </section>

        {/* Right / Form panel */}
        <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:w-1/2 lg:py-16">
          <div className="w-full max-w-md animate-[fadeInUp_0.8s_ease-out_both]">
            <h1 className="text-3xl font-extrabold text-[#6c5ce7] sm:text-4xl">
              Welcome <span className="inline-block animate-[wave_2.4s_ease-in-out_infinite] origin-bottom">:)</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              To keep connected with us please login with your personal information
              by email address and password
            </p>
            <Tabs
              defaultValue="signin"
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 bg-[#ff832f] w-full mb-6">
                <TabsTrigger value="signin" className="bg-[#ff832f] text-white hover:bg-[#ff832f]">
                  Sign in
                </TabsTrigger>

                <TabsTrigger value="signup" className="bg-[#ff832f] text-white hover:bg-[#ff832f]">
                  Create account
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form
                  onSubmit={onSignIn}
                  className="mt-8 space-y-4 p-12"
                >
                  {/* Username */}
                  <label className="group flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_10px_30px_-12px_rgba(2,6,23,0.15)] ring-1 ring-slate-100 transition focus-within:ring-2 focus-within:ring-[#6c5ce7]">
                    <svg className="h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Email
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e: { target: { value: SetStateAction<string>; }; }) =>
                          setEmail(e.target.value)
                        } className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        placeholder="yourmail@company.com"
                      />
                    </div>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </label>

                  {/* Password */}
                  <label className="group flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_10px_30px_-12px_rgba(2,6,23,0.15)] ring-1 ring-slate-100 transition focus-within:ring-2 focus-within:ring-[#6c5ce7]">
                    <svg className="h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="10" width="16" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 118 0v3" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Password
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e: { target: { value: SetStateAction<string>; }; }) =>
                          setPassword(e.target.value)
                        }
                        className="w-full bg-transparent text-sm tracking-widest text-slate-700 outline-none placeholder:text-slate-400"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="shrink-0 text-slate-400 transition hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </label>

                  {/* Remember / Forgot */}
                  <div className="flex items-center justify-between pt-1 text-sm">
                    <label className="flex cursor-pointer items-center gap-2 text-slate-500">
                      <span
                        onClick={() => setRemember((r) => !r)}
                        className={`grid h-5 w-5 place-items-center rounded-full border transition ${remember
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 bg-white"
                          }`}
                      >
                        {remember && (
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      Remember me
                    </label>
                    <a href="#" className="text-slate-500 transition hover:text-[#6c5ce7]">
                      Forgot password?
                    </a>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-gradient-to-r from-[#7d5cff] to-[#6c5ce7] py-3 text-sm font-semibold text-white shadow-[0_12px_25px_-10px_rgba(108,92,231,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-10px_rgba(108,92,231,0.8)] active:translate-y-0"
                    >
                      Login
                    </button>
                    {/* <button
                  type="button"
                  className="flex-1 rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-[#6c5ce7] hover:text-[#6c5ce7]"
                >
                  Join
                </button> */}
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <h2 className="font-bold text-3xl font-semibold mb-1">
                  Create your account
                </h2>

                <p className="text-muted-foreground mb-6 text-sm">
                  {/* First account becomes Super Admin. */}
                </p>

                <form
                  onSubmit={onSignUp}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <div className="min-w-0 flex-1">
                      <InputField
                        label="Company Name"
                        type="text"
                        placeholder="Your Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        success={!!companyName}
                        icon={<Building2 className="h-5 w-5" />}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <InputField
                      label="Email"
                      type="email"
                      placeholder="yourmail@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      // success={!!email}
                      icon={<Mail className="h-5 w-5" />}
                    />
                  </div>

                  <div className="space-y-2">

                    <InputField
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<Lock className="h-5 w-5" />}
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={busy}
                      className="flex-1 rounded-full bg-gradient-to-r from-[#7d5cff] to-[#6c5ce7] py-6 text-sm font-semibold text-white shadow-[0_12px_25px_-10px_rgba(108,92,231,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-10px_rgba(108,92,231,0.8)] active:translate-y-0"
                    >
                      {busy
                        ? "Creating..."
                        : "Create account"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>


            {/* Social */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">Join with</p>
              <div className="mt-3 flex items-center justify-center gap-3">
                {[
                  { label: "Facebook", bg: "#1877f2", path: "M13 22v-8h3l1-4h-4V7.5c0-1.1.4-2 2-2h2V2h-3c-3 0-5 1.8-5 5v3H6v4h3v8h4z" },
                  { label: "Google", bg: "#db4437", path: "M21 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.1c-.2 1.2-.9 2.2-2 2.9v2.4h3.2c1.9-1.7 2.9-4.3 2.9-7.1zM12 21c2.7 0 4.9-.9 6.5-2.4l-3.2-2.4c-.9.6-2 1-3.3 1-2.5 0-4.7-1.7-5.5-4H3.3v2.5C4.9 18.9 8.2 21 12 21zM6.5 13.2c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V6.7H3.3C2.5 8.3 2 10.1 2 12s.5 3.7 1.3 5.3l3.2-2.5zM12 6.5c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.9 3.7 14.7 2.8 12 2.8 8.2 2.8 4.9 5 3.3 8l3.2 2.5c.8-2.4 3-4 5.5-4z" },
                  { label: "Twitter", bg: "#1da1f2", path: "M22 5.9c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-1.5-1.6-4-1.7-5.6-.2-1 1-1.5 2.4-1.2 3.8-3.3-.2-6.2-1.7-8.1-4.2-1.1 1.8-.5 4.2 1.2 5.4-.6 0-1.3-.2-1.9-.5 0 2 1.4 3.7 3.4 4.1-.6.2-1.2.2-1.8.1.5 1.6 2 2.8 3.8 2.8-1.5 1.2-3.4 1.8-5.4 1.6 1.9 1.2 4.1 1.8 6.3 1.8 7.5 0 11.7-6.4 11.4-12.1.8-.6 1.5-1.3 2.1-2.1z" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    style={{ backgroundColor: s.bg }}
                    className="grid h-10 w-10 place-items-center rounded-full text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <p className="mt-10 text-center text-xs leading-relaxed text-slate-400">
              © Copyright 2019 InvoiceBill · Drivester Ltd. 67 Albion Street,
              <br className="hidden sm:block" />
              West Yorkshire, Leeds LS1 5AA, United Kingdom.
            </p>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: none; } }
        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes wave { 0%,60%,100% { transform: rotate(0); } 15% { transform: rotate(12deg); } 30% { transform: rotate(-8deg); } 45% { transform: rotate(6deg); } }
      `}</style>
    </div>
  )
}