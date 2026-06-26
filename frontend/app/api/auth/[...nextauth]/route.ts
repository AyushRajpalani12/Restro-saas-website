import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { BACKEND_URL } from "@/lib/config";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const result = await res.json();

          if (!res.ok) {
            throw new Error(result.error || "Authentication failed");
          }

          // Return the combined User and JWT token from backend
          return {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            restaurantId: result.user.restaurantId,
            branchId: result.user.branchId,
            token: result.token, // Store signed Express JWT in session
          };
        } catch (error: any) {
          throw new Error(error.message || "Failed to authorize");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.restaurantId = (user as any).restaurantId;
        token.branchId = (user as any).branchId;
        token.backendToken = (user as any).token; // Shared Express JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).restaurantId = token.restaurantId;
        (session.user as any).branchId = token.branchId;
        (session.user as any).token = token.backendToken; // Accessible for API headers
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
