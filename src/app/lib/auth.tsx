// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import User from "../models/user";
import { connectDB } from "@/app/lib/mongodb";

/**
 * The shape we expect when calling .lean() and including the password.
 */
type LeanUser = {
  _id: any;
  name?: string;
  email: string;
  password: string; // hashed password (we explicitly select this)
  role?: string;
};

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        const email = String(creds?.email || "").toLowerCase().trim();
        const password = String(creds?.password || "");

        // Demo account
        if (email === "demo@demo.com" && password === "demo123") {
          return {
            id: "demo-id",
            name: "Demo User",
            email,
            role: "demo",
          };
        }

        // Real user: check DB
        await connectDB();

        // include the password field if your schema uses select:false
        const raw = await User.findOne({ email })
          .select("+password")
          .lean(); // don't give generic here — we'll cast explicitly below

        // Explicitly assert the shape to avoid the "array union" typing issue:
        const user = raw as LeanUser | null;

        if (!user) return null;

        const ok = await compare(password, user.password);
        if (!ok) return null;

        return {
          id: String(user._id),
          name: user.name || email,
          email,
          role: user.role || "user",
        };
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.uid = (user as any).id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        (session.user as any).id = token.uid;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions as any);
