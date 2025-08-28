// src/app/api/invoices/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Invoice from "../../models/invoice";

// Helper: normalize to a previewable URL (esp. Google Drive)
function normalizePdfUrl(url?: string | null): string | null {
  if (!url) return null;

  // Force https (avoid mixed content)
  try {
    const u = new URL(url);
    if (u.protocol === "http:") {
      u.protocol = "https:";
      url = u.toString();
    }
  } catch {
    // ignore bad URL, return as-is below
  }

  // Google Drive formats → turn into preview URL
  // Ex: https://drive.google.com/file/d/<id>/view?...  OR ...?id=<id>
  const m1 = url.match(/[?&]id=([^&]+)/);
  const m2 = url.match(/\/d\/([^/]+)\/(view|preview|edit)/);
  const fileId = m1?.[1] || m2?.[1];
  if (fileId) {
    return `https://drive.google.com/uc?export=preview&id=${fileId}`;
  }

  // Otherwise return original (Cloudinary/S3/etc already previewable)
  return url;
}

// GET /api/invoices?isPaid=true|false&sortBy=amountDesc|amountAsc
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const isPaid = searchParams.get("isPaid"); // "true" | "false" | null
    const sortBy = searchParams.get("sortBy") || "amountDesc"; // default Higher Amount

    const filter: Record<string, any> = {};
    if (isPaid === "true") filter.isPaid = true;
    if (isPaid === "false") filter.isPaid = false;

    // Only amount-based sorting (as before)
    const sort: Record<string, 1 | -1> =
      sortBy === "amountAsc" ? { amount: 1 } : { amount: -1 };

    const items = await Invoice.find(filter)
      .setOptions({ strictPopulate: false })
      .populate("clientId", "name")
      .sort(sort)
      .lean();

    const safe = items.map((doc: any) => {
      const rawPdf = doc.pdfUrl || null;
      const preview = normalizePdfUrl(rawPdf);

      return {
        _id: String(doc._id),
        fyYear: doc.fyYear,
        client: doc.clientId
          ? { _id: String(doc.clientId._id), name: doc.clientId.name }
          : null,
        name: doc.name,
        date: doc.date,
        number: doc.number,
        amount: doc.amount,
        description: doc.description || "",
        isPaid: !!doc.isPaid,
        pdfUrl: rawPdf,                 // original (unchanged)
        pdfPreviewUrl: preview,         // ✅ added (use this in UI)
        createdAt: doc.createdAt,
      };
    });

    return NextResponse.json({ items: safe, total: safe.length });
  } catch (e: any) {
    console.error("GET /api/invoices error:", e);
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}

// POST /api/invoices (unchanged)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    // Optional: basic guard so pdfUrl is a string if provided
    if (body.pdfUrl != null && typeof body.pdfUrl !== "string") {
      return NextResponse.json({ error: "pdfUrl must be a string" }, { status: 400 });
    }
    const invoice = await Invoice.create(body);
    return NextResponse.json(invoice, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/invoices error:", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
