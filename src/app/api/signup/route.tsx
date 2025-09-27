// src/app/api/signup/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "../../models/user";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, company, address, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashed = await hash(password, 10);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone: phone || "",
      company: company || "",
      address: address || "",
      password: hashed,
      role: "user",
    });

    return NextResponse.json({ id: user._id, email: user.email }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Signup failed" }, { status: 500 });
  }
}
