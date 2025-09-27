// src/app/api/clients/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "../../lib/mongodb";
import Client from "../../models/client"; 

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { name, address, serviceType, joiningDate } = await req.json();
    if (!name || !address || !serviceType || !joiningDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // parse date safely
    const jd = new Date(joiningDate);
    if (isNaN(jd.getTime())) {
      return NextResponse.json({ error: "Invalid joiningDate" }, { status: 400 });
    }

    const email = session.user.email.toLowerCase();

    const client = await Client.create({
      ownerEmail: email,              // 🔒 attach owner
      name,
      address,
      serviceType,
      joiningDate: jd,
    });

    const res = NextResponse.json({ success: true, client }, { status: 201 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const email = session.user.email.toLowerCase();
    const clients = await Client.find({ ownerEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    const res = NextResponse.json({ success: true, clients }, { status: 200 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}
