"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import { toast } from "sonner";

export default function AuthPage() {
  const { user, loading } = useAuth();

  const router = useRouter();

  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

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
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* LEFT SIDE */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 text-sidebar-foreground"
        style={{ background: "var(--gradient-emerald)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Sparkles className="h-4 w-4 text-sidebar" />
          </div>

          <div>
            <div className="font-display text-xl font-semibold">
              InvoiceFlow
            </div>

            <div className="text-[10px] tracking-[0.25em] uppercase opacity-80">
              Pro
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="font-display text-5xl leading-[1.05] font-semibold">
            Tax invoices,
            <br />
            <span
              className="italic"
              style={{ color: "var(--gold)" }}
            >
              perfected.
            </span>
          </h1>

          <p className="text-base opacity-80 max-w-md leading-relaxed">
            GST-ready invoicing built for Indian businesses.
            Auto CGST/SGST/IGST, beautiful PDFs, and role-based
            team access.
          </p>
        </div>

        <div className="text-xs opacity-60">
          © InvoiceFlow Pro
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>

            <span className="font-display text-xl font-semibold">
              InvoiceFlow Pro
            </span>
          </div>

          {mode === "forgot" ? (
            <>
              <h2 className="font-display text-3xl font-semibold mb-1">
                Reset password
              </h2>

              <p className="text-muted-foreground mb-6 text-sm">
                We&apos;ll email you a reset link.
              </p>

              <form
                onSubmit={onForgot}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="ef" className="text-background">Email</Label>

                  <Input
                    id="ef"
                    type="email"
                    required
                    className="text-background"
                    value={email}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-primary hover:bg-primary-glow"
                >
                  {busy
                    ? "Sending..."
                    : "Send reset link"}
                </Button>

                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
                  onClick={() => setMode("signin")}
                >
                  Back to sign in
                </button>
              </form>
            </>
          ) : (
            <Tabs
              defaultValue="signin"
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 bg-[#fad162] w-full mb-6">
                <TabsTrigger value="signin">
                  Sign in
                </TabsTrigger>

                <TabsTrigger value="signup">
                  Create account
                </TabsTrigger>
              </TabsList>

              {/* SIGN IN */}
              <TabsContent value="signin">
                <h2 className="font-display text-foreground text-3xl font-semibold mb-1">
                  Welcome back
                </h2>

                <p className="text-muted-foreground mb-6 text-sm">
                  Sign in to manage your invoices.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  className="w-full mb-4"
                  onClick={onGoogle}
                >
                  Continue with Google
                </Button>

                <form
                  onSubmit={onSignIn}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="e1" className="text-foreground">Email</Label>

                    <Input
                      id="e1"
                      type="email"
                      required
                      value={email}
                      onChange={(e: { target: { value: SetStateAction<string>; }; }) =>
                        setEmail(e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="p1" className="text-foreground">
                        Password
                      </Label>

                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setMode("forgot")
                        }
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Input
                      id="p1"
                      type="password"
                      required
                      value={password}
                      onChange={(e: { target: { value: SetStateAction<string>; }; }) =>
                        setPassword(e.target.value)
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-primary hover:bg-primary-glow"
                  >
                    {busy
                      ? "Signing in..."
                      : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              {/* SIGN UP */}
              <TabsContent value="signup">
                <h2 className="font-display text-3xl font-semibold mb-1">
                  Get started
                </h2>

                <p className="text-muted-foreground mb-6 text-sm">
                  First account becomes Super Admin.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  className="w-full mb-4"
                  onClick={onGoogle}
                >
                  Continue with Google
                </Button>

                <form
                  onSubmit={onSignUp}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="c2" className="text-foreground">
                      Company name
                    </Label>

                    <Input
                      id="c2"
                      placeholder="Acme Pvt Ltd"
                      value={companyName}
                      onChange={(e: { target: { value: SetStateAction<string>; }; }) =>
                        setCompanyName(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="e2" className="text-foreground">
                      Email
                    </Label>

                    <Input
                      id="e2"
                      type="email"
                      required
                      value={email}
                      onChange={(e: { target: { value: SetStateAction<string>; }; }) =>
                        setEmail(e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p2" className="text-foreground">
                      Password
                    </Label>

                    <Input
                      id="p2"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e: { target: { value: SetStateAction<string>; }; }) =>
                        setPassword(e.target.value)
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-primary hover:bg-primary-glow"
                  >
                    {busy
                      ? "Creating..."
                      : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}