// src/app/api/clients/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Client from "../../../models/client";

type Params = { params: { id: string } };

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = params;
    const deleted = await Client.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}
