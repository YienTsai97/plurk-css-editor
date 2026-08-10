import { authGoogleSignIn } from "@/services/auth.service";
import NextAuth, { Account, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, account }: { user: User, account?: Account | null }) {
      // account only exists during OAuth sign in.
      // For other sign-in methods (e.g. email/password), account is undefined.
      if (!account) {
        console.error("Auth-signIn: account is undefined");
        return false;
      }
      if (!user || !user.email) {
        console.error("Auth-SignIn: user or user.email is undefined");
        return false;
      }

      const result = await authGoogleSignIn(
        {
          id: user.id ?? undefined,
          name: user.name ?? undefined,
          email: user.email,
          image: user.image ?? undefined
        } as User,
        account as Account
      );
      return result.success
    },
    async session({ session }: { session: Session }) {
      //Delete --- Error: PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in ``).
      // if (!session.user?.email) {
      //   console.error("Auth:session.user.email is undefined");
      //   return session;
      // }
      // const dbUser = await getUserByEmail(session.user.email)
      // if (dbUser.success && dbUser.data !== null && dbUser.data !== undefined) {
      //   session.user.id = dbUser.data.id
      //   session.user.name = dbUser.data.name
      //   session.user.image = dbUser.data.image
      //   session.user.email = dbUser.data.email

      // }
      return session
    },
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
})