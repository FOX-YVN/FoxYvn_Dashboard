import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }

      if (user || trigger === "update") {
        const userId = (user?.id ?? token.sub ?? token.id) as
          | string
          | undefined;
        if (userId) {
          const userWithPermissions = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          });
          const permissions =
            userWithPermissions?.permissions.map(
              (entry) => entry.permission.name
            ) ?? [];
          token.permissions = permissions;
          console.log(
            "[Auth]",
            `Cached permissions in JWT for ${token.email}:`,
            permissions
          );
        } else {
          token.permissions = [];
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token.sub ?? token.id) as string;
        (session.user as any).role = token.role;
        (session.user as any).permissions =
          (token.permissions as string[]) ?? [];
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
