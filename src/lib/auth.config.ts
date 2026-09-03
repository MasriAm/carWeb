import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/generated/prisma/client";

/**
 * Edge-safe half of the auth config: no database client, no bcrypt. `proxy.ts`
 * imports this, so everything here must run on the edge runtime. The `Role`
 * import is type-only and erases at compile time.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        // `user` widens to AdapterUser here, which carries no app fields. The
        // Credentials provider and the Prisma adapter both return them.
        token.role = (user as { role: Role }).role;
        token.isSuspended = (user as { isSuspended: boolean }).isSuspended;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isSuspended = token.isSuspended;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
