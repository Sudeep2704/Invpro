// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import User from "../models/user";
import { connectDB } from "@/app/lib/mongodb";

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
        const user = await User.findOne({ email }).lean();
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
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.uid;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
