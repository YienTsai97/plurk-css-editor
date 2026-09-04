import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "../auth.config"

const { auth } = NextAuth(authConfig)

const EDITOR_ONLY_MODE: boolean = process.env.EDITOR_ONLY_MODE === "true"

/** public/ 圖片素材由根路徑提供；next/image 優化時會再請求原始 URL */
const PUBLIC_IMAGE_PATH = /\.(png|jpe?g|gif|webp|svg|ico|avif)$/i

function isAllowedInEditorOnlyMode(pathname: string): boolean {
  if (PUBLIC_IMAGE_PATH.test(pathname)) {
    return true
  }

  const allowedPrefixes = ["/editor", "/about", "/under-construction", "/api/auth"]

  return allowedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export default auth((req) => {
  const isLoggedIn: boolean = !!req.auth
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  if (EDITOR_ONLY_MODE && !isAllowedInEditorOnlyMode(pathname)) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/editor", nextUrl))
    }
    return NextResponse.redirect(new URL("/under-construction", nextUrl))
  }

  if (isLoggedIn && pathname === "/auth/signin") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
