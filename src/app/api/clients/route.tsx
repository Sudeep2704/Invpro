// src/app/api/clients/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Client from "../../models/client";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, address, serviceType, joiningDate } = await req.json();

    if (!name || !address || !serviceType || !joiningDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await Client.create({
      name,
      address,
      serviceType,
      joiningDate: new Date(joiningDate), // accepts ISO or yyyy-mm-dd
    });

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, clients }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}
