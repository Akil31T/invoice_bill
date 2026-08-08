'use client'

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {  ArrowLeft } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { supabase } from "../../../integrations/supabase/client";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "sonner";
import InvoiceForm from "@/app/components/InvoiceForm";

export default function NewInvoicePage() {
  return (
    // <ProtectedRoute>
    <NewInvoice />
    // </ProtectedRoute>
  );
}

type Item = {
  name: string; description?: string; hsn_code?: string;
  quantity: number; unit: string; unit_price: number;
  discount_pct: number; gst_rate: number;
};

const blankItem = (): Item => ({ name: "", quantity: 1, unit: "pcs", unit_price: 0, discount_pct: 0, gst_rate: 18 });

function NewInvoice() {
  const { user } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [customerId, setCustomerId] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [status, setStatus] = useState("pending");
  const [isInterstate, setIsInterstate] = useState(false);
  const [items, setItems] = useState<Item[]>([blankItem()]);
  const [shipping, setShipping] = useState(0);
  const [extraCharge, setExtraCharge] = useState(0);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("Payment due within 15 days. Late payments may incur interest @1.5% per month.");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const [c, p, pr, last] = await Promise.all([
        supabase.from("customers").select("*").order("name"),
        supabase.from("products").select("*").order("name"),
        supabase.from("profiles").select("*").maybeSingle(),
        supabase
          .from("invoices")
          .select("invoice_number")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);

      setCustomers(c.data || []);
      setProducts(p.data || []);
      setProfile(pr.data);

      // Generate next invoice number for current user
      const lastNum = last.data?.[0]?.invoice_number || "";
      const match = lastNum.match(/(\d+)$/);

      const nextNumber = match
        ? String(Number(match[1]) + 1).padStart(4, "0")
        : "0001";

      setInvoiceNumber(`Invoice-${nextNumber}`);
    };

    loadData();
  }, []);

  // auto interstate from customer
  useEffect(() => {
    if (!customerId || !profile?.state) return;
    const c = customers.find((x) => x.id === customerId);
    if (c?.state) setIsInterstate(c.state.trim().toLowerCase() !== profile.state.trim().toLowerCase());
  }, [customerId, customers, profile]);


  const calc = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    const lines = items.map((it) => {
      const qty = Number(it.quantity || 0);
      const price = Number(it.unit_price || 0);
      const discountPct = Number(it.discount_pct || 0);
      const gstRate = Number(it.gst_rate || 0);

      const gross = qty * price;
      const discountAmt = (gross * discountPct) / 100;
      const taxable = gross - discountAmt;
      const taxAmt = (taxable * gstRate) / 100;

      subtotal += gross;
      totalDiscount += discountAmt;
      totalTax += taxAmt;

      return {
        gross,
        taxable,
        taxAmt,
        total: taxable + taxAmt,
      };
    });

    const cgst = isInterstate ? 0 : totalTax / 2;
    const sgst = isInterstate ? 0 : totalTax / 2;
    const igst = isInterstate ? totalTax : 0;

    const grandTotal =
      subtotal -
      totalDiscount +
      totalTax +
      Number(shipping || 0) +
      Number(extraCharge || 0);

    return {
      subtotal,
      discount: totalDiscount,
      totalTax,
      cgst,
      sgst,
      igst,
      lines,
      grandTotal: isNaN(grandTotal) ? 0 : grandTotal, // FIX
    };
  }, [items, isInterstate, shipping, extraCharge]);

  const updateItem = (i: number, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  };

  const pickProduct = (i: number, productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    updateItem(i, { name: p.name, description: p.description, hsn_code: p.hsn_code, unit: p.unit, unit_price: Number(p.unit_price) });
  };

  const save = async () => {
    if (!user) return;
    if (!customerId) return toast.error("Pick a customer");
    if (items.some((i) => !i.name)) return toast.error("All items need a name");
    setSaving(true);
    const customer = customers.find((c) => c.id === customerId);
    const { data: inv, error } = await supabase.from("invoices").insert({
      user_id: user.id,
      invoice_number: invoiceNumber,
      customer_id: customerId,
      customer_snapshot: customer,
      invoice_date: invoiceDate,
      vehicle_no: vehicleNo,
      due_date: dueDate || null,
      status,
      is_interstate: isInterstate,
      subtotal: calc.subtotal,
      discount: calc.discount,
      cgst: calc.cgst, sgst: calc.sgst, igst: calc.igst,
      shipping: Number(shipping || 0),
      additional_charge: Number(extraCharge || 0),
      total: calc.grandTotal,
      notes, terms,
    }).select().single();

    if (error || !inv) { setSaving(false); return toast.error(error?.message || "Failed"); }

    const itemRows = items.map((it, idx) => ({
      invoice_id: inv.id,
      user_id: user.id,
      name: it.name,
      description: it.description,
      hsn_code: it.hsn_code,
      quantity: it.quantity, unit: it.unit,
      unit_price: it.unit_price,
      discount_pct: it.discount_pct,
      // gst_rate: it.gst_rate,
      taxable: calc.lines[idx].taxable,
      tax_amount: calc.lines[idx].taxAmt,
      total: calc.lines[idx].total,
      position: idx,
    }));
    const { error: itemErr } = await supabase.from("invoice_items").insert(itemRows);
    setSaving(false);
    if (itemErr) return toast.error(itemErr.message);
    toast.success("Invoice saved");
    router.push(`/dashboard/invoices/${inv.id}`);
  };
console.log(customers, 'akil');

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <button onClick={() => router.push("/dashboard/invoices")} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold">New invoice</h1>
          <p className="text-muted-foreground mt-1.5">Fill in the details to generate a GST tax invoice.</p>
        </div>
        {/* <Button onClick={save} disabled={saving} className="bg-primary hover:bg-primary-glow"><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save invoice"}</Button> */}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InvoiceForm customers={customers} products={products} invoiceId={customerId} save={'Save'}/>

        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-4">Notes & terms</h3>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Notes</Label><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes for the customer" /></div>
            <div className="space-y-2"><Label>Terms & conditions</Label><Textarea rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} /></div>
          </div>
        </div>

      </div>
    </div>
  );
}
