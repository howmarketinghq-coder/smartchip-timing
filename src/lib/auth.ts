import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[AUTH] authorize called with username:", credentials?.username);

        if (!credentials?.username || !credentials?.password) {
          console.log("[AUTH] Missing credentials");
          return null;
        }

        try {
          const admin = await prisma.admin.findUnique({
            where: { username: credentials.username as string },
          });

          console.log("[AUTH] Admin found:", admin ? "yes" : "no");

          if (!admin) {
            console.log("[AUTH] Admin not found for username:", credentials.username);
            return null;
          }

          console.log("[AUTH] Stored hash:", admin.password);
          console.log("[AUTH] Input password:", credentials.password);

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            admin.password
          );

          console.log("[AUTH] Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: admin.id,
            name: admin.username,
          };
        } catch (error) {
          console.error("[AUTH] Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
