// src/app/api/clients/[id]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Client from "../../../models/client";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // Read id from the path instead of using the context param
    // e.g. /api/clients/66cf2a... -> "66cf2a..."
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const deleted = await Client.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}
