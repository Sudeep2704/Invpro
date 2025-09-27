// app/invoices/list/page.tsx
import Link from "next/link";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Invoice = {
  _id: string;
  number?: string;
  name?: string;
  date?: string;
  fyYear?: string;
  amount?: number | string;
  isPaid?: boolean;
  client?: { _id: string; name: string } | null;
  pdfUrl?: string;
  pdfPreviewUrl?: string;
  createdAt?: string;
};

const toNum = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const fmtINR = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtDate = (d?: string) => {
  if (!d) return "-";
  const dt = new Date(d);
  return isNaN(+dt) ? String(d) : dt.toLocaleDateString("en-IN");
};
const normalizePdfUrl = (url?: string | null) => {
  if (!url) return url ?? undefined;
  try {
    const u = new URL(url);
    if (u.protocol === "http:") u.protocol = "https:";
    url = u.toString();
  } catch {}
  const m1 = url.match(/[?&]id=([^&]+)/);
  const m2 = url.match(/\/d\/([^/]+)\/(view|preview|edit)/);
  const fileId = m1?.[1] || m2?.[1];
  if (fileId) return `https://drive.google.com/uc?export=preview&id=${fileId}`;
  return url;
};

// Handy helper: coerce string | string[] | undefined -> string
const s = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v ?? "";

async function getInvoices(params: {
  status?: "paid" | "unpaid" | "";
  sort?: "amountDesc" | "amountAsc" | "dateDesc" | "dateAsc" | "";
}): Promise<Invoice[]> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protoHeader = h.get("x-forwarded-proto");
  const proto =
    protoHeader && (protoHeader === "https" || protoHeader === "http")
      ? protoHeader
      : process.env.NODE_ENV === "production"
      ? "https"
      : "http";

  const qs = new URLSearchParams();
  if (params.status === "paid") qs.set("isPaid", "true");
  if (params.status === "unpaid") qs.set("isPaid", "false");
  if (params.sort === "amountAsc") qs.set("sortBy", "amountAsc");
  else if (params.sort === "amountDesc") qs.set("sortBy", "amountDesc");
  else qs.set("sortBy", "amountDesc");

  const url = `${proto}://${host}/api/invoices?${qs.toString()}`;

  // 🔐 Forward session cookies to API so it can resolve the current user
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Cookie: cookieHeader },
  });

  if (res.status === 401) {
    // Not logged in → send to login (preserve return url if you want)
    redirect("/login");
  }
  if (!res.ok) return [];

  const data = await res.json();
  const items: Invoice[] = Array.isArray(data)
    ? (data as any)
    : data.items ?? data.invoices ?? [];
  return items;
}

export default async function InvoicesListPage({
  searchParams,
}: {
  searchParams?: {
    status?: "paid" | "unpaid";
    sort?: "amountDesc" | "amountAsc" | "dateDesc" | "dateAsc";
    fy?: string;
    client?: string;
    q?: string;
  };
}) {
  // Read raw values for the UI (don’t lowercase here)
  const status = s(searchParams?.status) as "paid" | "unpaid" | "";
  const sort = (s(searchParams?.sort) || "dateDesc") as
    | "amountDesc"
    | "amountAsc"
    | "dateDesc"
    | "dateAsc";
  const fy = s(searchParams?.fy);
  const clientInput = s(searchParams?.client);
  const qInput = s(searchParams?.q);

  // Values used for comparisons (lowercased)
  const clientLc = clientInput.toLowerCase().trim();
  const qLc = qInput.toLowerCase().trim();

  const items = await getInvoices({ status, sort });

  // Build options dynamically
  const fyOptions = Array.from(
    new Set(items.map((i) => i.fyYear).filter(Boolean) as string[])
  ).sort();

  // Apply FY / client-name / free-text filters server-side (in this component)
  let rows = items.filter((inv) => {
    if (fy && inv.fyYear !== fy) return false;
    if (clientLc && !(inv.client?.name || "").toLowerCase().includes(clientLc))
      return false;
    if (qLc) {
      const hay = [inv.number || "", inv.name || "", inv.client?.name || ""]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(qLc)) return false;
    }
    return true;
  });

  // Enforce chosen sort (date sorts done here)
  if (sort === "dateDesc" || sort === "dateAsc") {
    rows = rows.sort((a, b) => {
      const ad = new Date(a.date || a.createdAt || 0).getTime();
      const bd = new Date(b.date || b.createdAt || 0).getTime();
      return sort === "dateDesc" ? bd - ad : ad - bd;
    });
  } else if (sort === "amountAsc" || sort === "amountDesc") {
    rows = rows.sort((a, b) =>
      sort === "amountDesc"
        ? toNum(b.amount) - toNum(a.amount)
        : toNum(a.amount) - toNum(b.amount)
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <div className="flex gap-3">
            <Link
              href="/dashboard/addhom/addinv"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              + Add Invoice
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>

        {/* Active filters (debug-friendly) */}
        <div className="flex flex-wrap gap-2 text-xs">
          {status && (
            <span className="px-2 py-1 bg-white border rounded">
              Status: {status}
            </span>
          )}
          {sort && (
            <span className="px-2 py-1 bg-white border rounded">Sort: {sort}</span>
          )}
          {fy && (
            <span className="px-2 py-1 bg-white border rounded">FY: {fy}</span>
          )}
          {clientInput && (
            <span className="px-2 py-1 bg-white border rounded">
              Client: “{clientInput}”
            </span>
          )}
          {qInput && (
            <span className="px-2 py-1 bg-white border rounded">
              Search: “{qInput}”
            </span>
          )}
          {!status && !fy && !clientInput && !qInput && (
            <span className="text-gray-400">No filters</span>
          )}
        </div>

        {/* Filter / Sort Bar */}
        {/* ... (unchanged UI below) ... */}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Inv No</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">FY</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No invoices found.
                  </td>
                </tr>
              )}

              {rows.map((inv) => {
                const url = normalizePdfUrl(inv.pdfPreviewUrl || inv.pdfUrl);
                return (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">
                      {inv.number || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {fmtDate(inv.date || inv.createdAt)}
                    </td>
                    <td className="px-4 py-3">{inv.client?.name || "—"}</td>
                    <td className="px-4 py-3">{inv.fyYear || "—"}</td>
                    <td className="px-4 py-3">{fmtINR(toNum(inv.amount))}</td>
                    <td className="px-4 py-3">
                      {inv.isPaid ? (
                        <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
                          Paid
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-200">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                            title="View PDF"
                          >
                            View PDF
                          </a>
                        ) : (
                          <button
                            className="inline-flex cursor-not-allowed items-center rounded bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500"
                            title="No PDF uploaded"
                            disabled
                          >
                            No PDF
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500">
          Showing {rows.length} invoice{rows.length === 1 ? "" : "s"}.
        </p>
      </div>
    </main>
  );
}
