// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: { auth: any; request: { nextUrl: URL } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        return isLoggedIn; // Only allow if logged in
      }

      if (isLoggedIn) {
        // Redirect to dashboard if logged in and not already there
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true; // Allow access to public pages
    },
  },
  providers: [],
} satisfies NextAuthConfig;
