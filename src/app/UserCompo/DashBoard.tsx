"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardCharts from "./DataViewAdd/DashboardCharts";

type Invoice = { amount: number; isPaid: boolean };

type Activity = {
  id: string;
  message: string;
  time: string;
  type?: "invoice" | "client" | "alert";
};


export default function DashBoard() {

  const [totalInvoices, setTotalInvoices] = useState(0);
  const [paidInvoices, setPaidInvoices] = useState(0);
  const [unpaidInvoices, setUnpaidInvoices] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [overdue, setOverdue] = useState<Activity[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/invoices", { cache: "no-store" });
        const data = await res.json();
        const items: Invoice[] = data?.items || []; // ✅ matches your API

        const total = items.length;
        const paid = items.filter((i) => i.isPaid).length;
        const unpaid = items.filter((i) => !i.isPaid).length;
        const sum = items.reduce((a, v) => a + Number(v.amount || 0), 0);

        setTotalInvoices(total);
        setPaidInvoices(paid);
        setUnpaidInvoices(unpaid);
        setTotalAmount(sum);
      } catch (err) {
        console.error("Error loading invoices:", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/invoices", { cache: "no-store" });
        const data = await res.json();
        const items = data?.items || [];

        // Simulated activity feed from invoices + clients
        const feed: Activity[] = items.slice(0, 5).map((inv: any) => ({
          id: inv._id,
          message: `Invoice ${inv.number} added for ${inv.client?.name || "Unknown"}`,
          time: new Date(inv.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          type: "invoice",
        }));

        // Overdue alerts → unpaid and older than 30 days
        const now = new Date();
        const alerts: Activity[] = items
          .filter((i: any) => !i.isPaid && i.date)
          .filter((i: any) => {
            const d = new Date(i.date);
            return !isNaN(+d) && (now.getTime() - d.getTime()) / (1000 * 3600 * 24) > 30;
          })
          .map((inv: any) => ({
            id: inv._id,
            message: `⚠️ Overdue: Invoice ${inv.number} (${inv.client?.name || "Unknown"})`,
            time: new Date(inv.date).toLocaleDateString("en-IN"),
            type: "alert",
          }));

        setActivities(feed);
        setOverdue(alerts);
      } catch (err) {
        console.error("Error loading activity:", err);
      }
    })();
  }, []);

  return (
    <>
        
  <h2 className="text-4xl font-bold mb-3">DashBoard</h2>
  <div className="h-2/5 w-full mb-2 flex gap-2">
  {/* Left 60% */}
  <div className="w-[60%] border border-gray-400 rounded-lg h-full">
    <div className="grid grid-cols-4 gap-2 h-full p-2">

       {/* Total Invoices */}
    <div className="border border-gray-400 rounded-lg flex flex-col items-center justify-center p-4">
          <p className="text-lg text-gray-600">Total Invoices</p>
          <p className="text-2xl font-semibold">{totalInvoices}</p>
        </div>

        {/* Paid Invoices */}
        <div className="border border-gray-400 rounded-lg flex flex-col items-center justify-center p-4">
          <p className="text-lg text-gray-600">Paid Invoices</p>
          <p className="text-2xl font-semibold text-green-600">{paidInvoices}</p>
        </div>

        {/* Unpaid Invoices */}
        <div className="border border-gray-400 rounded-lg flex flex-col items-center justify-center p-4">
          <p className="text-lg text-gray-600">Unpaid Invoices</p>
          <p className="text-2xl font-semibold text-red-600">{unpaidInvoices}</p>
        </div>

        {/* Total Amount */}
        <div className="border border-gray-400 rounded-lg flex flex-col items-center justify-center p-4">
          <p className="text-lg text-gray-600">Total Amount</p>
          <p className="text-2xl font-semibold text-blue-600">
            ₹{totalAmount.toLocaleString()}
          </p>
        </div>
  </div>
  </div>

  {/* Right 40% */}
  <div className="w-[40%] border border-gray-400 rounded-lg h-full">
   <div className="h-full max-h-[400px] overflow-y-auto pr-3 p-2">
    <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
    <ul className="space-y-2 text-sm">
      {activities.length === 0 && <p className="text-gray-500">No recent activity</p>}
      {activities.map((a) => (
        <li
          key={a.id}
          className="border-b border-gray-200 pb-2 last:border-none flex flex-col"
        >
          <span className="text-gray-800">{a.message}</span>
          <span className="text-xs text-gray-500">{a.time}</span>
        </li>
      ))}
    </ul>

    <h2 className="text-xl font-semibold mt-5 mb-3">Notifications</h2>
    <ul className="space-y-2 text-sm">
      {overdue.length === 0 && <p className="text-gray-500">No alerts</p>}
      {overdue.map((a) => (
        <li
          key={a.id}
          className="bg-red-50 border border-red-200 text-red-700 p-2 rounded"
        >
          <span className="font-medium">{a.message}</span>
          <div className="text-xs">{a.time}</div>
        </li>
      ))}
    </ul>
  </div>
  </div>
</div>

<h2 className="text-4xl font-bold mb-3">Quick Links</h2>
  <div className="border border-gray-600 rounded-lg h-2/5 w-full mb-2">

  <div className="grid grid-cols-6 gap-2 h-full p-2">
    {/* Content Inside 1card */}
    <Link href="/dashboard/addhom">
    <div className="border border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center text-center h-full">
    <img 
    src="/addfile.svg"  // SVG filename
    alt="Icon"
    className="w-18 h-18 mb-2"
  />

  {/* Title */}
  <h3 className="text-2xl font-semibold text-gray-700">
    Add Data
  </h3>
    </div>
    </Link>

    {/* Content Inside 2card */}
    <div className="border border-gray-400 rounded-lg">
    <Link href="/dashboard/viewanalytics">
    <div className="border border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center text-center h-full">
    <img 
    src="/Viewanalytics.svg"  // SVG filename
    alt="Icon"
    className="w-18 h-18 mb-2"
  />

  {/* Title */}
  <h3 className="text-2xl font-semibold text-gray-700">
    Analytics
  </h3>
    </div>
    </Link>
    </div>

    {/* Content Inside 3card */}
    <div className="border border-gray-400 rounded-lg">
      <Link href="/underconst">
    <div className="border border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center text-center h-full">
    <img 
    src="/reports.svg"  // SVG filename
    alt="Icon"
    className="w-18 h-18 mb-2"
  />

  {/* Title */}
  <h3 className="text-2xl font-semibold text-gray-700">
    Reports
  </h3>
    </div>
    </Link>
    </div>

    {/* Content Inside 4card */}
    <div className="border border-gray-400 rounded-lg">
      <Link href="/dashboard/viewhome">
    <div className="border border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center text-center h-full">
    <img 
    src="/viewdata.svg"  // SVG filename
    alt="Icon"
    className="w-18 h-18 mb-2"
  />

  {/* Title */}
  <h3 className="text-2xl font-semibold text-gray-700">
    View Data
  </h3>
    </div>
    </Link>
    </div>

    {/* Content Inside 5card */}
    <div className="border border-gray-400 rounded-lg">
      <Link href="/underconst">
    <div className="border border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center text-center h-full">
    <img 
    src="/editdata.svg"  // SVG filename
    alt="Icon"
    className="w-18 h-18 mb-2"
  />

  {/* Title */}
  <h3 className="text-2xl font-semibold text-gray-700">
    Edit Data
  </h3>
    </div>
    </Link>
    </div>

    {/* Content Inside 6card */}
    <div className="border border-gray-400 rounded-lg">
       <Link href="/dashboard/clientdash">
    <div className="border border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center text-center h-full">
    <img 
    src="/clients.svg"  // SVG filename
    alt="Icon"
    className="w-18 h-18 mb-2"
  />

  {/* Title */}
  <h3 className="text-2xl font-semibold text-gray-700">
    Manage Clients
  </h3>
    </div>
    </Link>
    </div>
  </div>
  </div>

  <h2 className="text-4xl font-bold mb-3">Summary</h2>
  <div className="border border-gray-600 rounded-lg h-[300px] w-full mb-2">
  <DashboardCharts/>
  </div>
  

        
      </>
  );
}
