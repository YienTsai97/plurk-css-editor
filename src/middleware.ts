import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "../auth.config"

const { auth } = NextAuth(authConfig)

//Editor only mode
const EDITOR_ONLY_MODE: boolean = process.env.EDITOR_ONLY_MODE === "true"
const isAllowedInEditorOnlyMode = (pathname: string): boolean => {
  const allowedPaths = [
    "/editor",
    "/under-construction",
    "/assets/public",
    "/api/auth",
    "/testicon",
    "/plurk-icon.svg",
  ]
  return allowedPaths.some(allowedPath => pathname.startsWith(allowedPath))
}

//Middleware
export default auth((req) => {
  const isLoggedIn: boolean = !!req.auth
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  //Editor only mode access control
  if (EDITOR_ONLY_MODE && !isAllowedInEditorOnlyMode(pathname)) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/editor", nextUrl))
    }
    return NextResponse.redirect(new URL("/under-construction", nextUrl))
  }

  //Dashboard access control
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl))
    }
    if (isLoggedIn && pathname === "/auth/signin") {
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



