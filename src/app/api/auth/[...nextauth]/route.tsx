// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        await connectDB();
        const user = await User.findOne({ email: creds?.email?.toLowerCase() }).lean();
        if (!user) return null;
        const ok = await compare(String(creds?.password), user.password);
        if (!ok) return null;

        // Return values you need in the token/session
        return {
          id: String(user._id),
          email: user.email,
          name: user.fullName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.email) session.user.email = token.email as string;
      if (token?.name) session.user.name = token.name as string;
      // @ts-ignore
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
