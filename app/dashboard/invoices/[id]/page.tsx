"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter, useParams } from "next/navigation";

import { ArrowLeft, Printer, Download } from "lucide-react";

import { ProtectedRoute } from "../../../components/ProtectedRoute";

import { Button } from "../../../components/ui/button";

import { Badge } from "../../../components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { supabase } from "../../../integrations/supabase/client";

import { inr, formatDate, numberToWordsINR } from "../../../lib/format";

import { toast } from "sonner";

function getFinancialYear(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const m = d.getMonth();
  const y = d.getFullYear();
  return m >= 3 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

export default function InvoiceDetailPage() {
  return (
    // <ProtectedRoute>
    <InvoiceDetail />
    // </ProtectedRoute>
  );
}

function InvoiceDetail() {
  const router = useRouter();

  const params = useParams();

  const id = params?.id as string;

  const [inv, setInv] = useState<any>(null);

  const [items, setItems] = useState<any[]>([]);

  const [profile, setProfile] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const [invoiceRes, itemsRes, profileRes] = await Promise.all([
          supabase.from("invoices").select("*").eq("id", id).single(),

          supabase
            .from("invoice_items")
            .select("*")
            .eq("invoice_id", id)
            .order("position"),

          supabase.from("profiles").select("*").eq("id", user.id).single(),
        ]);

        if (invoiceRes.error) {
          console.error(invoiceRes.error);

          toast.error(invoiceRes.error.message);

          return;
        }

        setInv(invoiceRes.data);

        setItems(itemsRes.data || []);

        setProfile(profileRes.data);
      } catch (err) {
        console.error(err);

        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const updateStatus = async (status: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({
        status,
      })
      .eq("id", id);

    if (error) {
      toast.error(error.message);

      return;
    }

    setInv({
      ...inv,
      status,
    });

    toast.success("Status updated");
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!inv) {
    return <div className="p-10">Invoice not found</div>;
  }

  const cust = inv.customer_snapshot || {};

  const totalAmount = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
    0,
  );

  const cgst = totalAmount * 0.09;

  const sgst = totalAmount * 0.09;

  const grandTotal = totalAmount + cgst + sgst;

  const badgeCls =
    (
      {
        paid: "bg-green-100 text-green-700 border-green-200",

        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",

        partial: "bg-blue-100 text-blue-700 border-blue-200",
      } as Record<string, string>
    )[inv.status] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="p-3 md:p-6 lg:p-10 max-w-5xl mx-auto">
      {/* Toolbar - hidden in print */}
      <div className="no-print mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button onClick={() => router.push( "/invoices" )} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 self-start">
          <ArrowLeft className="h-4 w-4" /> Back to invoices
        </button>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={inv.status} onValueChange={updateStatus}>
            <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" /> <span className="hidden sm:inline">Print</span></Button>
          <Button size="sm" onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700"><Download className="h-4 w-4" /> <span className="hidden sm:inline">Save as PDF</span></Button>
        </div>
      </div>
      {/* Print styles injected inline so they travel with the component */}
      <style>{`
        @media print {
          thead { display: table-header-group !important; }
          tbody { display: table-row-group !important; }
          tr    { page-break-inside: avoid; break-inside: avoid; }
          thead tr th {
            background-color: #2563eb !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-no-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      {/* Scroll wrapper — keeps invoice layout intact on small screens */}
      <div className="no-print-wrapper overflow-x-auto -mx-3 md:mx-0 print:overflow-visible">
        {/* Invoice Paper */}
        <div className="bg-white text-black border-1 border-black rounded-none p-4 md:p-6 print:p-4 text-[12px] md:text-[13px] leading-tight min-w-[600px] md:min-w-0">

          {/* Heading */}
          {/* <div className="text-center pb-2 mb-2">
          <h1 className="text-2xl font-bold">Tax Invoice</h1>
          <p className="text-xs">(ORIGINAL FOR RECIPIENT)</p>
        </div> */}

          {/* Top section */}
          <div className="grid grid-cols-2 border-black border-1 ">
            {/* Seller */}
            <div className="border-r-1 border-black p-2">
              <h2 className="font-bold text-lg uppercase">
                {profile?.company_name || "Your Company"}
              </h2>

              <p>{profile?.address}</p>
              <p>
                {[profile?.city, profile?.state, profile?.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {profile?.gstin && (
                <p>
                  <b>GST:</b> {profile.gstin}
                </p>
              )}
              {/* <p><b>Bank:</b> {profile.bank_name}</p>
            <p><b>A/C No:</b> {profile.bank_account}</p>
            <p><b>IFSC:</b> {profile.bank_ifsc}</p> */}
              {/* <p><b>PAN No:</b> {profile.pan_no}</p> */}
            </div>

            {/* Invoice info */}
            <div>
              {/* Row 1 */}
              <div className="grid grid-cols-2 border-black border-b">
                <div className="p-1 border-black border-r">
                  <b>Invoice No.</b>
                  <p>{inv.invoice_number}</p>
                  <p>2026-2027</p>
                </div>

                <div className="p-2">
                  <b>Dated</b>
                  <p>{formatDate(inv.invoice_date)}</p>
                </div>
              </div>

              {/* Row 2 (FIX HERE) */}
              <div className="grid grid-cols-2 border-black items-stretch">
                <div className="p-2 border-black border-r capitalize flex flex-col justify-between">
                  <b>Status</b>
                  <p>{inv.status}</p>
                </div>

                 <div className="p-2 flex flex-col justify-between">
                  <b>Vehicle No.</b>
                  <p>{inv.vehicle_no}</p>
                </div>
              </div>

           
            </div>
          </div>

          {/* Buyer */}
          <div className="grid grid-cols-2 border-x border-b border-black">
            {/* Buyer */}
            <div className="border-r border-black p-2">
              <h3 className="font-bold mb-1">Buyer (Bill to)</h3>

              <p className="font-semibold text-base">{cust.name}</p>

              {cust.billing_address && <p>{cust.billing_address}</p>}

              {/* <p>
              {[cust.city, cust.state, cust.pincode]
                .filter(Boolean)
                .join(", ")}
            </p> */}

              {cust.gstin && (
                <p>
                  <b>GSTIN:</b> {cust.gstin}
                </p>
              )}
            </div>

        
          </div>

          {/* Items */}
          <table className="mt-2 w-full border border-gray-400 border-collapse text-[12px]">

            {/* HEADER */}
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-400 p-2 w-[5%]">Sl No.</th>
                <th className="border border-gray-400 p-2 text-left w-[35%]">
                  Description of Goods
                </th>
                <th className="border border-gray-400 p-2 w-[10%]">HSN/SAC</th>
                <th className="border border-gray-400 p-2 w-[10%]">Qty</th>
                <th className="border border-gray-400 p-2 w-[10%]">Unit</th>
                <th className="border border-gray-400 p-2 w-[15%]">Rate</th>
                <th className="border border-gray-400 p-2 w-[15%]">Amount</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {/* ITEMS */}
              {items.map((it, i) => (
                <tr key={i}>
                  <td className="border-r border-gray-400 p-2">{i + 1}</td>
                  <td className="border-r border-gray-400 p-2">{it.name}</td>
                  <td className="border-r border-gray-400 p-2">{it.hsn_code}</td>
                  <td className="border-r border-gray-400 p-2 text-center">{it.quantity}</td>
                  <td className="border-r border-gray-400 p-2 text-center uppercase">{it.unit}</td>
                  <td className="border-r border-gray-400 p-2 text-right">₹{it.unit_price}</td>
                  <td className="border-r border-gray-400 p-2 text-right">₹{it.taxable}</td>
                </tr>
              ))}

              {/* TOTAL */}
              <tr className="h-[200px]">
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>

                <td className="border-r border-gray-400 p-2 text-right font-bold">
                </td>
              </tr>
              <tr>
                <td className="border-r border-gray-400"></td>

                <td className="border-r border-gray-400 p-2 font-bold">
                </td>
                <td className="border-r border-gray-400 p-2 font-bold">
                </td>
                <td className="border-r border-gray-400"></td>

                <td className="border-r border-gray-400"></td>

                <td className="border-r border-gray-400"></td>

                <td className="border-r border-gray-400 p-2 text-right font-bold">
                  {inr(totalAmount)}
                </td>
              </tr>
              {/* CGST */}
              <tr>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>

                <td className="border-r border-gray-400 p-2 text-right italic">
                  CGST @9%
                </td>
                <td className="border-r border-gray-400 p-2 text-right">
                  {inr(cgst)}
                </td>
              </tr>

              {/* SGST */}
              <tr>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400 p-2 text-right italic">
                  SGST @9%
                </td>
                <td className="border-r border-gray-400 p-2 text-right">
                  {inr(sgst)}
                </td>
              </tr>

              {/* GRAND TOTAL */}
              <tr>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>
                <td className="border-r border-gray-400"></td>

                {/* <td className="border-r border-gray-400 p-2 text-right font-bold">
                GRAND TOTAL
              </td>
              <td className="border-r border-gray-400 p-2 text-right font-bold">
                {inr(grandTotal)}
              </td> */}
              </tr>

            </tbody>
          </table>


          {/* Taxable value in words */}
          <div className="print-no-break grid grid-cols-2 border-x-1 border-b border-black p-3">
            <div>
              <b>Total Amount (in words):</b>
              <p className="mt-1 font-semibold">
                {numberToWordsINR(Number(grandTotal))}
              </p>
            </div>
            <div>

              <p className="font-bold flex justify-end gap-12">
                <span>Total:</span>
                <span>{inr(grandTotal)}</span>
              </p>
            </div>

          </div>
          {/* Footer */}
          <div className="print-no-break grid grid-cols-2 border-x-1 border-black border-b-1">
            <div className="border-r border-black  p-3">
              <h3 className="font-bold mb-2">Declaration</h3>
              <p className="text-xs">
                We declare that this invoice shows the actual price of the goods
                described and that all particulars are true and correct.
              </p>

              {profile?.bank_name && (
                <>
                  <h3 className="font-bold mt-4 mb-2">Bank Details</h3>
                  <p>A/C Name: {profile.company_name}</p>
                  <p>Bank: {profile.bank_name}</p>
                  <p>A/C No: {profile.bank_account}</p>
                  <p>IFSC: {profile.bank_ifsc}</p>
                  {/* <p>PAN No: {profile.pan_no}</p> */}
                </>
              )}
            </div>

            <div className="p-3 flex flex-col justify-end items-end min-h-[180px]">
              <p className="font-semibold mb-20">
                for {profile?.company_name}
              </p>

              <div className="border-t  border-black pt-2 text-sm text-center w-52">
                Authorised Signatory
              </div>
            </div>
          </div>
          {/* 
        <div className="text-center mt-3 text-xs">
          This is a Computer Generated Invoice
        </div> */}
        </div>
      </div>

    </div>
  );
}
