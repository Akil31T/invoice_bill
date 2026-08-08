'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Search, FileText, Pencil, Trash2 } from "lucide-react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../integrations/supabase/client";
import { inr, formatDate } from "../../lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import InvoiceForm from "@/app/components/InvoiceForm";
import { toast } from "sonner";

export default function InvoicesPage() {
  return (
    // <ProtectedRoute>
    <InvoicesList />
    // </ProtectedRoute>
  );
}

function InvoicesList() {
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editInvoiceId, setEditInvoiceId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data: invoices, error: invoiceError } = await supabase
          .from("invoices")
          .select("*")
          .eq("user_id", user.id)
          .order("invoice_date", { ascending: false });

        if (invoiceError) {
          console.error("Invoice error:", invoiceError);
          setLoading(false);
          return;
        }

        setList(invoices || []);

        // -------------------------
        // Get ALL products
        // -------------------------
        const { data: allProducts, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("user_id", user.id)
          .order("name");

        if (productsError) {
          console.error("Products error:", productsError);
        }

        setProducts(allProducts || []);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const filtered = list.filter((i) => {
    if (status !== "all" && i.status !== status) return false;
    if (q && !i.invoice_number.toLowerCase().includes(q.toLowerCase()) && !(i.customer_snapshot?.name || "").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const badgeCls = (s: string) => ({
    paid: "bg-success/15 text-success border-success/30",
    pending: "bg-warning/15 text-warning border-warning/40",
    partial: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  } as Record<string, string>)[s] || "bg-muted text-muted-foreground border-border";


  const deleteInvoice = async (invoiceId: string) => {
    if (!invoiceId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) return;

    try {
      // Delete invoice items first
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", invoiceId);

      if (itemsError) {
        throw itemsError;
      }

      // Delete invoice
      const { error: invoiceError } = await supabase
        .from("invoices")
        .delete()
        .eq("id", invoiceId);

      if (invoiceError) {
        throw invoiceError;
      }

      toast.success("Invoice deleted successfully");

      // Refresh invoice list
      // loadInvoices();
      window.location.reload()

    } catch (error: any) {
      console.error("Delete invoice error:", error);

      toast.error(
        error?.message || "Failed to delete invoice"
      );
    }
  };
  console.log(filtered, 'filtered');

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <PageHeader
        title="Invoices"
        subtitle="All your tax invoices in one place."
        action={<Button onClick={() => router.push("/dashboard/invoices/create")} className="bg-primary hover:bg-primary-glow"><Plus className="h-4 w-4" /> New invoice</Button>}
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoice # or customer…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold mb-1">No invoices yet</h3>
            <p className="text-sm text-muted-foreground mb-5">Create your first tax invoice to get started.</p>
            <Button onClick={() => router.push("/dashboard/invoices/create")}>Create invoice</Button>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="md:hidden divide-y divide-border overflow-y-auto max-h-[calc(100dvh-310px)]">
              {filtered.map((i) => (
                <div
                  key={i.id}
                  className="p-4 hover:bg-muted/30 active:bg-muted/50 cursor-pointer"
                  onClick={() => router.push(`/dashboard/invoices/${i.id}`)}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{i.invoice_number}</span>
                    <Badge variant="outline" className={`${badgeCls(i.status)} shrink-0`}>{i.status}</Badge>
                  </div>
                  <div className="text-sm font-medium mb-1.5 truncate">{i.customer_snapshot?.name || "—"}</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(i.invoice_date)}
                      {i.due_date ? ` · Due ${formatDate(i.due_date)}` : ""}
                    </span>
                    <span className="font-semibold text-sm text-primary shrink-0">{inr(Number(i.total))}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm [table-layout:fixed]">
                <thead className="[display:table] w-full [table-layout:fixed] bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium w-[18%]">Invoice #</th>
                    <th className="text-left px-5 py-3 font-medium w-[24%]">Customer</th>
                    <th className="text-left px-5 py-3 font-medium w-[14%]">Date</th>
                    <th className="text-left px-5 py-3 font-medium w-[14%]">Due</th>
                    <th className="text-right px-5 py-3 font-medium w-[15%]">Amount</th>
                    <th className="text-center px-5 py-3 font-medium w-[15%]">Status</th>
                    <th className="px-5 py-3 font-medium w-[15%]">Actions</th>

                  </tr>
                </thead>
                <tbody className="block overflow-y-auto max-h-[calc(100dvh-310px)]">
                  {filtered.map((i) => (
                    <tr key={i.id} className="[display:table] w-full [table-layout:fixed] border-t border-border hover:bg-muted/30 cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${i.id}`)}>
                      <td className="px-5 py-3.5 font-medium w-[18%] truncate">{i.invoice_number}</td>
                      <td className="px-5 py-3.5 w-[24%] truncate">{i.customer_snapshot?.name || "—"}</td>
                      <td className="px-5 py-3.5 text-muted-foreground w-[14%]">{formatDate(i.invoice_date)}</td>
                      <td className="px-5 py-3.5 text-muted-foreground w-[14%]">{i.due_date ? formatDate(i.due_date) : "—"}</td>
                      <td className="px-5 py-3.5 text-right font-semibold w-[15%]">{inr(Number(i.total))}</td>
                      <td className="px-5 py-3.5 text-center w-[15%] capitalize"><Badge variant="outline" className={badgeCls(i.status)}>{i.status}</Badge></td>
                      <td className="px-5 py-3.5 text-center w-[15%]">
                        <Button size="icon" variant="ghost" onClick={(e) => {
                          e.stopPropagation();

                          setEditInvoiceId(i.id);
                          setEditOpen(true);
                        }}><Pencil className="h-4 w-4" /></Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();

                            deleteInvoice(i.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>

          {editInvoiceId && (
            <InvoiceForm
              invoiceId={editInvoiceId}
              customers={filtered.map((i) => i.customer_snapshot).filter(Boolean)}
              products={products}
              save={'Edit'}
              onSuccess={() => {
                setEditOpen(false);
                setEditInvoiceId(null);
                // loadInvoices();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
