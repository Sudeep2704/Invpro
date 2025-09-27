// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "../../lib/mongodb";
import User from "@/app/models/user";

export const dynamic = "force-dynamic"; // avoid cached session in App Router

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const email = String(session.user.email).toLowerCase();

    // select only needed fields; also tolerate legacy "name"
    const user = await User.findOne({ email })
      .select("fullName name email phone address company")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: String(user._id),
      fullName: user.fullName ?? user.name ?? "",   // <— tolerate old docs
      email: user.email,
      phone: user.phone ?? "",
      address: user.address ?? "",
      company: user.company ?? "",
    });
  } catch (e: any) {
    console.error("GET /api/profile error:", e);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { phone, address, company } = await req.json();
    await connectDB();
    const email = String(session.user.email).toLowerCase();

    const updated = await User.findOneAndUpdate(
      { email },
      { $set: { phone: phone ?? "", address: address ?? "", company: company ?? "" } },
      { new: true, projection: { fullName: 1, name: 1, email: 1, phone: 1, address: 1, company: 1 } }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: String(updated._id),
      fullName: updated.fullName ?? updated.name ?? "",
      email: updated.email,
      phone: updated.phone ?? "",
      address: updated.address ?? "",
      company: updated.company ?? "",
    });
  } catch (e: any) {
    console.error("PUT /api/profile error:", e);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
