import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {

  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/editor")) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/editor/:path*",
  ],
}