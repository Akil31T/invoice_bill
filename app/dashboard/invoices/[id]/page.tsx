"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter, useParams } from "next/navigation";

import {
  ArrowLeft,
  Printer,
  Download,
} from "lucide-react";

import { ProtectedRoute } from "../../../components/ProtectedRoute";

import { Button } from "../../../components/ui/button";

import {
  Badge,
} from "../../../components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { supabase } from "../../../integrations/supabase/client";

import {
  inr,
  formatDate,
  numberToWordsINR,
} from "../../../lib/format";

import { toast } from "sonner";

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

  const [profile, setProfile] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const [invoiceRes, itemsRes, profileRes] =
          await Promise.all([
            supabase
              .from("invoices")
              .select("*")
              .eq("id", id)
              .single(),

            supabase
              .from("invoice_items")
              .select("*")
              .eq("invoice_id", id)
              .order("position"),

            supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single(),
          ]);

        if (invoiceRes.error) {
          console.error(invoiceRes.error);

          toast.error(
            invoiceRes.error.message,
          );

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

  const updateStatus = async (
    status: string,
  ) => {
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
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  if (!inv) {
    return (
      <div className="p-10">
        Invoice not found
      </div>
    );
  }

  const cust = inv.customer_snapshot || {};

  const totalAmount = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.unit_price || 0),
    0,
  );

  const cgst = totalAmount * 0.09;

  const sgst = totalAmount * 0.09;

  const grandTotal =
    totalAmount + cgst + sgst;

  const badgeCls =
    ({
      paid:
        "bg-green-100 text-green-700 border-green-200",

      pending:
        "bg-yellow-100 text-yellow-700 border-yellow-200",

      partial:
        "bg-blue-100 text-blue-700 border-blue-200",
    } as Record<string, string>)[
      inv.status
    ] ||
    "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="p-3 md:p-6 lg:p-10 max-w-5xl mx-auto">
      {/* TOOLBAR */}

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <button
          onClick={() =>
            router.push("/invoices")
          }
          className="text-sm text-gray-500 hover:text-black inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to invoices
        </button>

        <div className="flex flex-wrap gap-2">
          <Select
            value={inv.status}
            onValueChange={updateStatus}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="pending">
                Pending
              </SelectItem>

              <SelectItem value="paid">
                Paid
              </SelectItem>

              <SelectItem value="partial">
                Partial
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 mr-2" />

            Print
          </Button>

          <Button
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4 mr-2" />

            Save PDF
          </Button>
        </div>
      </div>

      {/* INVOICE */}

      <div className="overflow-x-auto">
        <div className="bg-white text-black border border-black min-w-[700px]">
          {/* HEADER */}

          <div className="grid grid-cols-2 border-b border-black">
            <div className="p-4 border-r border-black">
              <h1 className="text-2xl font-bold">
                {profile?.company_name ||
                  "Company"}
              </h1>

              <p>{profile?.address}</p>

              <p>
                {profile?.city},{" "}
                {profile?.state}
              </p>

              <p>
                GSTIN: {profile?.gstin}
              </p>
            </div>

            <div>
              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-3 border-r border-black">
                  <p className="font-semibold">
                    Invoice No
                  </p>

                  <p>
                    {inv.invoice_number}
                  </p>
                </div>

                <div className="p-3">
                  <p className="font-semibold">
                    Date
                  </p>

                  <p>
                    {formatDate(
                      inv.invoice_date,
                    )}
                  </p>
                </div>
              </div>

              <div className="p-3">
                <Badge
                  className={badgeCls}
                >
                  {inv.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* CUSTOMER */}

          <div className="border-b border-black p-4">
            <h2 className="font-bold mb-2">
              Buyer
            </h2>

            <p className="font-semibold">
              {cust.name}
            </p>

            <p>
              {cust.billing_address}
            </p>

            <p>
              GSTIN: {cust.gstin}
            </p>
          </div>

          {/* TABLE */}

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-black p-2">
                  #
                </th>

                <th className="border border-black p-2 text-left">
                  Item
                </th>

                <th className="border border-black p-2">
                  Qty
                </th>

                <th className="border border-black p-2">
                  Rate
                </th>

                <th className="border border-black p-2">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="border border-black p-2">
                    {i + 1}
                  </td>

                  <td className="border border-black p-2">
                    {item.name}
                  </td>

                  <td className="border border-black p-2 text-center">
                    {item.quantity}
                  </td>

                  <td className="border border-black p-2 text-right">
                    {inr(
                      item.unit_price,
                    )}
                  </td>

                  <td className="border border-black p-2 text-right">
                    {inr(item.taxable)}
                  </td>
                </tr>
              ))}

              <tr>
                <td
                  colSpan={4}
                  className="border border-black p-2 text-right font-bold"
                >
                  Sub Total
                </td>

                <td className="border border-black p-2 text-right">
                  {inr(totalAmount)}
                </td>
              </tr>

              <tr>
                <td
                  colSpan={4}
                  className="border border-black p-2 text-right"
                >
                  CGST 9%
                </td>

                <td className="border border-black p-2 text-right">
                  {inr(cgst)}
                </td>
              </tr>

              <tr>
                <td
                  colSpan={4}
                  className="border border-black p-2 text-right"
                >
                  SGST 9%
                </td>

                <td className="border border-black p-2 text-right">
                  {inr(sgst)}
                </td>
              </tr>

              <tr>
                <td
                  colSpan={4}
                  className="border border-black p-2 text-right font-bold"
                >
                  Grand Total
                </td>

                <td className="border border-black p-2 text-right font-bold">
                  {inr(grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* FOOTER */}

          <div className="border-t border-black p-4">
            <p className="font-semibold">
              Amount in Words
            </p>

            <p>
              {numberToWordsINR(
                grandTotal,
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}