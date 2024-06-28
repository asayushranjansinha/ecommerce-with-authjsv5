import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getUserById } from "@/data/user"
import prisma from '@/lib/db'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import authConfig from "./auth.config"
import { getAccountByUserId } from './data/account'


declare module "next-auth" {
  /**
   * Returned by 'auth' , 'useSession', 'getSession' and recieved as a prop on the 'SessionProvider' React Context
   */
  interface Session {
    user: {
      /** The user's role 
       */
      id: string
      role?: UserRole
      isTwoFactorEnabled: boolean
      isOAuth: boolean
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** User role */
    email: string
    role?: UserRole
    isOAuth: boolean
    isTwoFactorEnabled: boolean
  }
}

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user || !user.id) return false;

      // Allow OAuth without email verification

      if (account?.provider !== "credentials") return true;

      // Prevent signIn without email verification
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (!twoFactorConfirmation) {
          return false;
        }

        // Delete two factor token confirmation token for next signIn
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          }
        });
      }

      return true;
    },

    async session({ session, user, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth;
      }
      console.log({ session })
      return session;
    },

    async jwt({ token, user, trigger, session }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);


      token.isOAuth = !!existingAccount
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      // console.log({token})
      return token;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  debug: true,
  ...authConfig,
});