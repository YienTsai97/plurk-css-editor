import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// 調試環境變數
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '已設定' : '未設定')
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '已設定' : '未設定')
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '已設定' : '未設定')

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // 如果 URL 是相對路徑，加上 baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // 預設重定向到 dashboard
      return `${baseUrl}/dashboard`
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
}

export default NextAuth(authOptions)