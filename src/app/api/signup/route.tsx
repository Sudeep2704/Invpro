// src/app/api/signup/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "../../models/user";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await connectDB();
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashed = await hash(password, 10);
    const user = await User.create({
      name: name || "",
      email: email.toLowerCase(),
      password: hashed,
      role: "user",
    });

    return NextResponse.json({ id: user._id, email: user.email }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Signup failed" }, { status: 500 });
  }
}
