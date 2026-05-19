"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  FileText,
  IndianRupee,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { supabase } from "../integrations/supabase/client";
import { inr, formatDate } from "../lib/format";

type Invoice = {
  id: string;
  invoice_number: string;
  total: number;
  status: string;
  invoice_date: string;
  due_date: string | null;
  customer_snapshot: {
    name?: string;
  } | null;
};

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: any;
  accent?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            {label}
          </p>

          <h2 className="text-4xl font-bold mt-3 text-[#002b1f]">
            {value}
          </h2>
        </div>

        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center"
          style={{
            background: accent || "#f5f5f5",
          }}
        >
          <Icon className="h-5 w-5 text-[#002b1f]" />
        </div>
      </div>
    </div>
  );
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    paid:
      "bg-green-100 text-green-700 border-green-200",

    pending:
      "bg-yellow-100 text-yellow-700 border-yellow-200",

    overdue:
      "bg-red-100 text-red-700 border-red-200",
  };

  return (
    map[status] ||
    "bg-gray-100 text-gray-700 border-gray-200"
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [invoices, setInvoices] = useState<
    Invoice[]
  >([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("invoice_date", {
          ascending: false,
        });

      console.log(data, error);

      if (!error && data) {
        setInvoices(data as Invoice[]);
      }

      setLoading(false);
    };

    fetchInvoices();
  }, []);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const overdue = invoices.filter(
    (i) =>
      i.status !== "paid" &&
      i.due_date &&
      new Date(i.due_date) < today,
  );

  const paid = invoices.filter(
    (i) => i.status === "paid",
  );

  const pending = invoices.filter(
    (i) =>
      i.status === "pending" ||
      i.status === "partial",
  );

  const revenue = paid.reduce(
    (sum, i) => sum + Number(i.total),
    0,
  );

  const months: {
    label: string;
    revenue: number;
  }[] = [];

  const formatCurrency = (
    amount: number,
  ) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-5xl font-bold text-[#002b1f]">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Your invoicing at a glance.
          </p>
        </div>

        <Button
          className="bg-[#003b2b] hover:bg-[#002b1f] text-white h-12 px-5 rounded-xl"
          onClick={() =>
            router.push(
              "/dashboard/invoices/create",
            )
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Quick invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          label="Total Invoices"
          value={String(invoices.length)}
          icon={FileText}
        />

        <StatCard
          label="Paid"
          value={String(paid.length)}
          icon={IndianRupee}
          accent="#dcfce7"
        />

        <StatCard
          label="Pending"
          value={String(pending.length)}
          icon={Clock}
          accent="#fef9c3"
        />

        <StatCard
          label="Overdue"
          value={String(overdue.length)}
          icon={AlertCircle}
          accent="#fee2e2"
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white lg:col-span-2 border rounded-xl p-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h3 className="text-xl text-black font-semibold">
                Revenue
              </h3>

              <p className="text-sm text-gray-500">
                Last 6 months
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase">
                Total
              </div>

              <div className="text-2xl text-black font-semibold">
                {inr(revenue)}
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={months}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="rev"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [
                    inr(Number(value)),
                    "Revenue",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#ffff] bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl text-black font-semibold">
              Recent
            </h3>

            <Link
              href="/dashboard/invoices"
              className="text-sm text-primary flex items-center gap-1"
            >
              View all

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-sm">
              Loading...
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 mx-auto mb-3 text-gray-400" />

              <p className="text-sm text-muted-foreground mb-4">
                No invoices found
              </p>

              <Button
                onClick={() =>
                  router.push(
                    "/dashboard/invoices/new",
                  )
                }
              >
                Create Invoice
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices
                .slice(0, 5)
                .map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/dashboard/invoices/${inv.id}`}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        {inv.invoice_number}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {inv.customer_snapshot
                          ?.name || "—"}{" "}
                        ·{" "}
                        {formatDate(
                          inv.invoice_date,
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {inr(
                          Number(inv.total),
                        )}
                      </div>

                      <Badge
                        variant="outline"
                        className={`text-[10px] mt-1 ${statusBadge(
                          inv.status,
                        )}`}
                      >
                        {inv.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}