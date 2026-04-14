import authConfig from "../auth.config"
import NextAuth from "next-auth"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn: boolean = !!req.auth
  const { nextUrl } = req

  if (nextUrl.pathname.startsWith("/dashboard")
    // || nextUrl.pathname.startsWith("/editor")
  ) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl))
    }
    if (isLoggedIn && nextUrl.pathname === "/auth/signin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
}