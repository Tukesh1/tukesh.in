import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";

// Augment the default Session to carry GitHub-specific fields we rely on
// (id, login, createdAt) through JWT callbacks.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      login: string;
      createdAt?: string;
    } & DefaultSession["user"];
  }
}

/**
 * Only trust the incoming Host header in safe contexts:
 *  - Local development (localhost is not exposed to untrusted clients).
 *  - Managed platforms that sanitize Host (Vercel).
 *  - Operators who explicitly opt in via AUTH_TRUST_HOST or AUTH_URL.
 * This avoids Host-header spoofing on self-hosted deployments behind an
 * unconfigured reverse proxy.
 */
const trustHost =
  process.env.NODE_ENV !== "production" ||
  process.env.AUTH_TRUST_HOST === "true" ||
  Boolean(process.env.AUTH_URL) ||
  Boolean(process.env.VERCEL);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost,
  providers: [
    GitHub({
      profile(profile) {
        return {
          id: String(profile.id),
          login: profile.login,
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          // GitHub account creation date; used as a spam guard.
          createdAt: profile.created_at,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as {
          id: string;
          login: string;
          createdAt?: string;
        };
        token.id = u.id;
        token.login = u.login;
        token.createdAt = u.createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.login = (token.login as string) ?? "";
        session.user.createdAt = token.createdAt as string | undefined;
      }
      return session;
    },
  },
  pages: {
    // Keep the default signin page; we drive sign-in from a button on /guestbook.
  },
});
