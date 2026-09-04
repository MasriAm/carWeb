/**
 * Edge-safe half of the auth config: no database client, no bcrypt. `proxy.ts`
 * imports this, so everything here must run on the edge runtime. The `Role`
 * import is type-only and erases at compile time.
 */

import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/generated/prisma/client";
import { normalizeOrigin } from "@/lib/normalize-origin";

/**
 * Repair `AUTH_URL` before next-auth reads it.
 *
 * `reqWithEnvURL` (next-auth/lib/env.js) runs `new URL(process.env.AUTH_URL)`
 * with no try/catch on every request that reaches `auth()` — here that is the
 * proxy plus every server component resolving a session. An origin pasted from
 * an address bar, without its scheme, therefore turns each of those into a bare
 * 500 carrying a digest and no message. Both `setEnvDefaults` helpers guard the
 * identical parse; that one call does not.
 *
 * This module is the single thing both `proxy.ts` and `lib/auth.ts` import
 * before constructing NextAuth, so the repair belongs here. A value that cannot
 * be repaired is dropped instead: next-auth then infers the origin from the
 * request, which is correct on Vercel anyway — `VERCEL` alone keeps `trustHost`
 * on — and a working guess beats a 500 on every authenticated route.
 */
function repairAuthUrlEnv(): void {
  for (const key of ["AUTH_URL", "NEXTAUTH_URL"] as const) {
    const raw = process.env[key];
    if (!raw) continue;

    const normalized = normalizeOrigin(raw);
    if (normalized === raw) continue;

    try {
      if (normalized) {
        process.env[key] = normalized;
      } else {
        delete process.env[key];
        console.warn(
          `[auth] ${key} is not a usable URL (${JSON.stringify(raw)}). ` +
            `Ignoring it and inferring the origin from the request instead.`
        );
      }
    } catch {
      // A read-only env object is not worth crashing the import over.
    }
  }
}

repairAuthUrlEnv();

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
