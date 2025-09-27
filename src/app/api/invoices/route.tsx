// src/app/api/invoices/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "../../lib/mongodb";
import Invoice from "@/app/models/invoice";
import Client from "../../models/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper: normalize to a previewable URL (esp. Google Drive)
function normalizePdfUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol === "http:") {
      u.protocol = "https:";
      url = u.toString();
    }
  } catch {}
  const m1 = url.match(/[?&]id=([^&]+)/);
  const m2 = url.match(/\/d\/([^/]+)\/(view|preview|edit)/);
  const fileId = m1?.[1] || m2?.[1];
  if (fileId) return `https://drive.google.com/uc?export=preview&id=${fileId}`;
  return url;
}

// GET /api/invoices?isPaid=true|false&sortBy=amountDesc|amountAsc
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const email = session.user.email.toLowerCase();
    const { searchParams } = new URL(req.url);
    const isPaid = searchParams.get("isPaid"); // "true" | "false" | null
    const sortBy = searchParams.get("sortBy") || "amountDesc";

    const filter: Record<string, any> = { ownerEmail: email }; // 🔒 scope to owner
    if (isPaid === "true") filter.isPaid = true;
    if (isPaid === "false") filter.isPaid = false;

    const sort: Record<string, 1 | -1> =
      sortBy === "amountAsc" ? { amount: 1 } : { amount: -1 };

    const items = await Invoice.find(filter)
      .setOptions({ strictPopulate: false })
      .populate({ path: "clientId", model: Client, select: "name" })
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
        pdfUrl: rawPdf,
        pdfPreviewUrl: preview,
        createdAt: doc.createdAt,
      };
    });

    const res = NextResponse.json({ items: safe, total: safe.length });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e: any) {
    console.error("GET /api/invoices error:", e);
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}

// POST /api/invoices
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const email = session.user.email.toLowerCase();
    const body = await req.json();

    // basic validation
    if (body.pdfUrl != null && typeof body.pdfUrl !== "string") {
      return NextResponse.json({ error: "pdfUrl must be a string" }, { status: 400 });
    }
    if (!body.fyYear || !body.name || !body.date || !body.number || body.amount == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 🔒 attach owner to every new invoice
    const invoice = await Invoice.create({
      ...body,
      ownerEmail: email,
    });

    const res = NextResponse.json(invoice, { status: 201 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (err: any) {
    console.error("POST /api/invoices error:", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
