"use client"
import AuthButtons from "@/components/auth-buttons"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // 如果已登入，重定向到 dashboard
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">載入中...</p>
        </div>
      </div>
    )
  }

  // 如果未登入，顯示簡單的登入頁面
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            登入您的帳戶
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            使用 Google 帳戶登入
          </p>
        </div>

        {/* 使用 AuthButtons 組件 */}
        <div className="flex justify-center">
          <AuthButtons />
        </div>
      </div>
    </div>
  )
}