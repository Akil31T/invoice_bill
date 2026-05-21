'use client';

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { supabase } from "../../integrations/supabase/client";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";


type FieldProps = {
  k: string;
  label: string;
  type?: string;
  full?: boolean;
  form: any;
  setForm: any;
};

function Field({
  k,
  label,
  type = "text",
  full = false,
  form,
  setForm,
}: FieldProps) {
  return (
    <div className={`space-y-2 ${full ? "md:col-span-2" : ""}`}>
      <Label>{label}</Label>

      <Input
        type={type}
        value={form[k] || ""}
        onChange={(e) =>
          setForm((prev: any) => ({
            ...prev,
            [k]: e.target.value,
          }))
        }
      />
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();

  const [form, setForm] = useState<any>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setForm(data || {});
    };

    fetchProfile();
  }, [user]);

  // const save = async () => {
  //   if (!user) return;

  //   setBusy(true);

  //   const { error } = await supabase.from("profiles").upsert({
  //     ...form,
  //     id: user.id,
  //     updated_at: new Date().toISOString(),
  //   });

  //   setBusy(false);

  //   if (error) {
  //     toast.error(error.message);
  //   } else {
  //     toast.success("Company details saved");
  //   }
  // };


  const save = async () => {
  if (!user) return;

  setBusy(true);

  // Update profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      ...form,
      id: user.id,
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    setBusy(false);
    toast.error(profileError.message);
    return;
  }

  // Update auth metadata
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      company_name: form.company_name || "",
      gstin: form.gstin || "",
      phone: form.phone || "",
      email: form.email || "",
      website: form.website || "",
      address: form.address || "",
      city: form.city || "",
      state: form.state || "",
      pincode: form.pincode || "",
      country: form.country || "",
      bank_name: form.bank_name || "",
      bank_account: form.bank_account || "",
      bank_ifsc: form.bank_ifsc || "",
      pan_no: form.pan_no || "",
    },
  });

  setBusy(false);

  if (authError) {
    toast.error(authError.message);
  } else {
    toast.success("Company details saved");
  }
};


  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <PageHeader
        title="Company details"
        subtitle="This information appears on every invoice you create."
        action={
          <Button
            onClick={save}
            disabled={busy}
            className="bg-primary hover:bg-primary-glow"
          >
            <Save className="h-4 w-4 mr-2" />
            {busy ? "Saving…" : "Save"}
          </Button>
        }
      />

      <div className="space-y-6">
        <section className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-4">
            Business
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <Field
              k="company_name"
              label="Company name"
              form={form}
              setForm={setForm}
            />

            <Field
              k="gstin"
              label="GSTIN"
              form={form}
              setForm={setForm}
            />

            <Field
              k="phone"
              label="Phone"
              form={form}
              setForm={setForm}
            />

            <Field
              k="email"
              label="Email"
              type="email"
              form={form}
              setForm={setForm}
            />

            <Field
              k="website"
              label="Website"
              form={form}
              setForm={setForm}
            />
          </div>
        </section>

        <section className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-4">
            Address
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Street address</Label>

              <Textarea
                rows={2}
                value={form.address || ""}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </div>

            <Field
              k="city"
              label="City"
              form={form}
              setForm={setForm}
            />

            <Field
              k="state"
              label="State"
              form={form}
              setForm={setForm}
            />

            <Field
              k="pincode"
              label="Pincode"
              form={form}
              setForm={setForm}
            />

            <Field
              k="country"
              label="Country"
              form={form}
              setForm={setForm}
            />
          </div>
        </section>

        <section className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-4">
            Bank details
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Shown at the bottom of invoices.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Field
              k="bank_name"
              label="Bank name"
              form={form}
              setForm={setForm}
            />

            <Field
              k="bank_account"
              label="Account number"
              form={form}
              setForm={setForm}
            />

            <Field
              k="bank_ifsc"
              label="IFSC code"
              form={form}
              setForm={setForm}
            />
            <Field
              k="pan_no"
              label="PAN number"
              form={form}
              setForm={setForm}
            />
          </div>
        </section>
      </div>
    </div>
  );
}