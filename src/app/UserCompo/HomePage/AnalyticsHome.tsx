// app/invoices/analytics/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

type Invoice = {
  _id: string;
  number?: string;
  date?: string;            // ISO date or string
  amount?: number | string; // may be string in DB
  isPaid?: boolean;
  client?: { _id: string; name: string } | null; // ✅ comes from your API { items: [{ client: { _id, name } }]}
};

const COLORS = ["#16a34a", "#f59e0b"]; // green, amber
const BAR_COLOR = "#2563eb";           // blue for bars
const SECONDARY_BAR = "#10b981";       // green bars
const DANGER = "#ef4444";

const toNum = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);

const fmtINR = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const fmtDate = (d?: string) => {
  if (!d) return "-";
  const dt = new Date(d);
  return isNaN(+dt) ? String(d) : dt.toLocaleDateString("en-IN");
};

export default function AnalyticsPage() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch("/api/invoices?sortBy=amountDesc", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch invoices");
        const data = await res.json();
        const list: Invoice[] = (data?.items ?? data?.invoices ?? []) as any[];
        setItems(Array.isArray(list) ? list : []);
      } catch (e: any) {
        setErr(e?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const {
    totalInvoices,
    paidCount,
    unpaidCount,
    totalAmount,
    highest,
    lowest,
    paidAmount,
    unpaidAmount,
    lineData,
    pieCountData,
    pieAmountData,
    // NEW
    momDeltaPct,
    topClients,              // [{ client: string, amount: number }]
    top3SharePct,            // number
    avgInvoiceValue,         // number
    histData,                // [{ bucket: string, count: number }]
  } = useMemo(() => {
    const totalInvoices = items.length;

    const paid = items.filter((i) => i.isPaid === true);
    const unpaid = items.filter((i) => i.isPaid !== true);

    const paidCount = paid.length;
    const unpaidCount = unpaid.length;

    const totalAmount = items.reduce((a, v) => a + toNum(v.amount), 0);
    const paidAmount = paid.reduce((a, v) => a + toNum(v.amount), 0);
    const unpaidAmount = unpaid.reduce((a, v) => a + toNum(v.amount), 0);

    // Highest/Lowest by amount
    const highest = items.reduce<Invoice | null>((best, cur) => {
      if (!best) return cur;
      return toNum(cur.amount) > toNum(best.amount) ? cur : best;
    }, null);

    const lowest = items.reduce<Invoice | null>((worst, cur) => {
      if (!worst) return cur;
      return toNum(cur.amount) < toNum(worst.amount) ? cur : worst;
    }, null);

    // Month-wise totals: key by YYYY-MM
    const buckets = new Map<string, number>();
    for (const inv of items) {
      const d = inv.date ? new Date(inv.date) : null;
      const key =
        d && !isNaN(+d)
          ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
          : "Unknown";
      buckets.set(key, (buckets.get(key) || 0) + toNum(inv.amount));
    }

    // Sort chronologically for known months; keep Unknown at end
    const keys = [...buckets.keys()].sort((a, b) => {
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return a.localeCompare(b);
    });

    const monthName = (key: string) => {
      if (key === "Unknown") return "Unknown";
      const [y, m] = key.split("-").map((x) => Number(x));
      const tmp = new Date(y, m - 1, 1);
      return tmp.toLocaleString("en-IN", { month: "short", year: "numeric" });
    };

    const lineData = keys.map((k) => ({
      month: monthName(k),
      amount: buckets.get(k) || 0,
      key: k,
    }));

    // -------- NEW: Month-over-Month % change (based on last two known months) ----------
    const knownMonths = lineData.filter((d) => d.key !== "Unknown");
    const last = knownMonths[knownMonths.length - 1]?.amount ?? 0;
    const prev = knownMonths[knownMonths.length - 2]?.amount ?? 0;
    const momDeltaPct =
      prev > 0 ? Math.round(((last - prev) / prev) * 100) : (last > 0 ? 100 : 0);

    // -------- NEW: Top 5 Clients by Revenue ------------------------------------------
    const clientTotals = new Map<string, number>();
    for (const inv of items) {
      const name = inv.client?.name || "Unknown";
      clientTotals.set(name, (clientTotals.get(name) || 0) + toNum(inv.amount));
    }
    const topClients = [...clientTotals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([client, amount]) => ({ client, amount }));

    // -------- NEW: Client concentration: top 3 share (%) ------------------------------
    const top3Sum = [...clientTotals.values()]
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((a, v) => a + v, 0);
    const top3SharePct =
      totalAmount > 0 ? Math.round((top3Sum / totalAmount) * 100) : 0;

    // -------- NEW: Average invoice value ----------------------------------------------
    const avgInvoiceValue =
      totalInvoices > 0 ? Math.round(totalAmount / totalInvoices) : 0;

    // -------- NEW: Histogram of invoice amounts ---------------------------------------
    const amounts = items.map((i) => toNum(i.amount)).filter((n) => Number.isFinite(n));
    let histData: { bucket: string; count: number }[] = [];
    if (amounts.length > 0) {
      const min = Math.min(...amounts);
      const max = Math.max(...amounts);
      const bins = 8;
      // Edge case: all amounts identical
      if (min === max) {
        histData = [{ bucket: fmtINR(min), count: amounts.length }];
      } else {
        const step = (max - min) / bins;
        const edges = Array.from({ length: bins + 1 }, (_, i) => min + i * step);
        const counts = Array.from({ length: bins }, () => 0);
        for (const n of amounts) {
          let idx = Math.floor((n - min) / step);
          if (idx >= bins) idx = bins - 1; // include max in last bin
          counts[idx]++;
        }
        histData = counts.map((c, i) => {
          const lo = Math.round(edges[i]);
          const hi = Math.round(edges[i + 1]);
          return { bucket: `${fmtINR(lo)}–${fmtINR(hi)}`, count: c };
        });
      }
    }

    const pieCountData = [
      { name: "Paid Invoices", value: paidCount },
      { name: "Unpaid Invoices", value: unpaidCount },
    ];

    const pieAmountData = [
      { name: "Paid Amount", value: paidAmount },
      { name: "Unpaid Amount", value: unpaidAmount },
    ];

    return {
      totalInvoices,
      paidCount,
      unpaidCount,
      totalAmount,
      highest,
      lowest,
      paidAmount,
      unpaidAmount,
      lineData,
      pieCountData,
      pieAmountData,
      // NEW
      momDeltaPct,
      topClients,
      top3SharePct,
      avgInvoiceValue,
      histData,
    };
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Invoice Analytics</h1>
          <div className="flex gap-3">
            <Link
              href="/invoices/overview"
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/addhom/addinv"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              + Add Invoice
            </Link>
          </div>
        </div>

        {/* Errors */}
        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
            {err}
          </div>
        )}

        {/* Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <>
            {/* Summary cards + NEW KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card title="Total Invoices" value={String(totalInvoices)} />
              <Card title="Paid Invoices" value={String(paidCount)} />
              <Card title="Unpaid Invoices" value={String(unpaidCount)} />
              <Card title="Total Amount" value={fmtINR(totalAmount)} />
              {/* NEW: MoM % Change */}
              <DeltaCard
                title="MoM Change"
                delta={momDeltaPct}
                positiveColor="text-green-600"
                negativeColor="text-red-600"
              />
            </div>

            {/* NEW: KPI Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="Avg Invoice Value" value={fmtINR(avgInvoiceValue)} />
              <Card
                title="Outstanding Balance"
                value={`${fmtINR(unpaidAmount)} (${totalAmount > 0 ? Math.round((unpaidAmount / totalAmount) * 100) : 0}%)`}
              />
              <Card title="Top 3 Client Share" value={`${top3SharePct}%`} />
            </div>

            {/* High/Low cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard
                title="Highest Amount Invoice"
                number={highest?.number || "-"}
                date={fmtDate(highest?.date)}
                amount={fmtINR(toNum(highest?.amount))}
              />
              <DetailCard
                title="Lowest Amount Invoice"
                number={lowest?.number || "-"}
                date={fmtDate(lowest?.date)}
                amount={fmtINR(toNum(lowest?.amount))}
              />
            </div>

            {/* Line chart */}
            <div className="bg-white border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Month-wise Total Amount</p>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `₹${Math.round(Number(v) / 1000)}k`} />
                    <Tooltip formatter={(value) => [fmtINR(Number(value)), "Amount"]} />
                    <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded p-4">
                <p className="text-sm text-gray-600 mb-2">Invoices: Paid vs Unpaid (Count)</p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieCountData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={(e) => `${e.name}: ${e.value}`}
                      >
                        {pieCountData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded p-4">
                <p className="text-sm text-gray-600 mb-2">Amount: Paid vs Unpaid (₹)</p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieAmountData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={(e) => `${e.name}: ${fmtINR(e.value)}`}
                      >
                        {pieAmountData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(v) => fmtINR(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* NEW: Top 5 Clients by Revenue */}
            <div className="bg-white border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-600 mb-2">Top 5 Clients by Revenue</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topClients}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="client" />
                    <YAxis tickFormatter={(v) => `₹${Math.round(Number(v) / 1000)}k`} />
                    <Tooltip formatter={(v) => fmtINR(Number(v))} />
                    <Bar dataKey="amount" fill={BAR_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* NEW: Invoice Amount Distribution (Histogram) */}
            <div className="bg-white border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-600 mb-2">Distribution of Invoice Amounts</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bucket" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={SECONDARY_BAR} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function DeltaCard({
  title,
  delta,
  positiveColor,
  negativeColor,
}: {
  title: string;
  delta: number;
  positiveColor?: string;
  negativeColor?: string;
}) {
  const isUp = delta >= 0;
  const color = isUp ? (positiveColor || "text-green-600") : (negativeColor || "text-red-600");
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <p className="text-sm text-gray-600">{title}</p>
      <p className={`text-2xl font-semibold mt-1 ${color}`}>
        {isUp ? "▲" : "▼"} {Math.abs(delta)}%
      </p>
      <p className="text-xs text-gray-500 mt-1">vs previous month</p>
    </div>
  );
}

function DetailCard({
  title,
  number,
  date,
  amount,
}: {
  title: string;
  number: string;
  date: string;
  amount: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <p className="text-sm text-gray-600">{title}</p>
      <div className="mt-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <div className="text-gray-900">
          <p className="text-base">
            <span className="text-gray-500">Inv No:</span> {number}
          </p>
          <p className="text-base">
            <span className="text-gray-500">Date:</span> {date}
          </p>
        </div>
        <p className="text-2xl font-semibold">{amount}</p>
      </div>
    </div>
  );
}
