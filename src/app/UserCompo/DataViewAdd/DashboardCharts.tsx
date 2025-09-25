// components/DashboardCharts.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";

type Invoice = {
  _id: string;
  date?: string;
  amount?: number | string;
  isPaid?: boolean;
  client?: { _id: string; name: string } | null;
  sector?: string | null;
};

const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const toNum = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}`;
const monthLabel = (k: string) => {
  const [y, m] = k.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, 1);
  return dt.toLocaleString("en-IN", { month: "short", year: "2-digit" });
};

// palette
const PAID = "#16a34a";     // green
const UNPAID = "#ef4444";   // red
const PIE_COLORS = ["#2563eb","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#a3a3a3"];

export default function DashboardCharts() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/invoices?sortBy=amountDesc", { cache: "no-store" });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : (data.items ?? []));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { stackedData, donutData } = useMemo(() => {
    // --- build last 12 months keys in order ---
    const months: string[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(monthKey(d));
    }

    // --- init accumulators ---
    const paidByMonth = new Map<string, number>(months.map(k => [k, 0]));
    const unpaidByMonth = new Map<string, number>(months.map(k => [k, 0]));
    const byBucket = new Map<string, number>(); // client/sector

    for (const inv of items) {
      const amt = toNum(inv.amount);
      const d = inv.date ? new Date(inv.date) : null;
      const k = d && !isNaN(+d) ? monthKey(d) : null;
      if (k && paidByMonth.has(k)) {
        if (inv.isPaid) paidByMonth.set(k, (paidByMonth.get(k) || 0) + amt);
        else            unpaidByMonth.set(k, (unpaidByMonth.get(k) || 0) + amt);
      }
      const bucket = inv.sector || inv.client?.name || "Unknown";
      byBucket.set(bucket, (byBucket.get(bucket) || 0) + amt);
    }

    // stacked bar dataset
    const stackedData = months.map(k => ({
      month: monthLabel(k),
      paid: paidByMonth.get(k) || 0,
      unpaid: unpaidByMonth.get(k) || 0,
    }));

    // donut dataset: top 6 + Others
    const sorted = [...byBucket.entries()].sort((a,b)=> b[1]-a[1]);
    const top = sorted.slice(0, 6);
    const others = sorted.slice(6).reduce((a, [,v]) => a + v, 0);
    const donutData = [
      ...top.map(([name, value]) => ({ name, value })),
      ...(others > 0 ? [{ name: "Others", value: others }] : []),
    ];

    return { stackedData, donutData };
  }, [items]);

  if (loading) {
    return (
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-3 p-3">
        {[...Array(2)].map((_,i)=><div key={i} className="rounded bg-gray-200 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-3 p-3">
      {/* Stacked Bar: Paid vs Unpaid per month */}
      <div className="bg-white border border-gray-200 rounded p-3 col-span-1 md:col-span-2">
        <p className="text-sm text-gray-600 mb-2">Paid vs Unpaid (Monthly)</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v)=>`₹${Math.round(Number(v)/1000)}k`} />
              <Tooltip formatter={(v)=> INR(Number(v))} />
              <Legend />
              <Bar dataKey="paid" stackId="a" fill={PAID} name="Paid" />
              <Bar dataKey="unpaid" stackId="a" fill={UNPAID} name="Unpaid" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut: revenue by client/sector */}
      <div className="bg-white border border-gray-200 rounded p-3">
        <p className="text-sm text-gray-600 mb-2">Revenue by Client/Sector</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                label={(e)=> `${e.name}: ${INR(e.value ?? 0)}`}
              >
                {donutData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v)=> INR(Number(v))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
