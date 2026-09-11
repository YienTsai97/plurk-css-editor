import { auth } from "@/auth";
import AuthButtons from "@/components/auth-buttons";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Plurk Styler
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            在真實樣貌的預覽上右鍵改樣式，匯出 CSS，貼回噗浪就生效。
            支援即時預覽、樣式匯入匯出與草稿儲存。
          </p>
        </div>
        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Public Editor */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                公開編輯器
              </h2>
              <p className="text-gray-600 mb-6">
                免登入即可使用，支援即時預覽、樣式匯入匯出、自動草稿儲存等功能
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/editor"
                className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ✏️ 開始編輯
              </Link>

              <Link
                href="/templates"
                className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-3 px-6 rounded-xl font-semibold text-base hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🎨 瀏覽模板
              </Link>

              <div className="text-sm text-gray-500 text-center">
                💡 無需帳號，立即開始創建你的 Plurk 樣式
              </div>
            </div>
          </div>

          {/* Project Management */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">📁</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                專案管理
              </h2>
              <p className="text-gray-600 mb-6">
                管理已儲存的專案，查看、編輯、刪除或分享你的 CSS 樣式
              </p>
            </div>

            <div className="space-y-4">
              {session ? (
                <>
                  <Link
                    href="/dashboard/projects"
                    className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    📁 管理專案 (資料庫)
                  </Link>

                  <Link
                    href="/projects"
                    className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 px-6 rounded-xl font-semibold text-base hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    💾 本地專案
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/projects"
                    className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    📁 管理專案 (本地)
                  </Link>

                  <div className="text-sm text-gray-500 text-center">
                    🔑 登入後可使用資料庫儲存，更安全可靠
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            ✨ 主要功能
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                即時預覽
              </h3>
              <p className="text-gray-600">
                編輯 CSS 時即時看到效果，支援 Plurk 各元件的完整預覽
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-4">📤</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                多種匯出
              </h3>
              <p className="text-gray-600">
                支援複製到剪貼簿、下載 .css 檔案、生成分享連結等多種匯出方式
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-4">💾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                雙重儲存
              </h3>
              <p className="text-gray-600">
                支援本地儲存和資料庫儲存，本地快速、資料庫安全可靠
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              🚀 快速開始
            </h2>
            <p className="text-xl mb-6 opacity-90">
              想要立即開始創建你的 Plurk 樣式嗎？
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/editor"
                className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                🎨 開始編輯
              </Link>

              {session ? (
                <Link
                  href="/dashboard/projects"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
                >
                  📁 管理專案
                </Link>
              ) : (
                <Link
                  href="/projects"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
                >
                  📁 管理專案
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Auth Section */}
        {session && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl shadow-lg p-6 inline-block">
              <p className="text-gray-700 mb-4">
                已登入為 <strong>{session.user?.email}</strong>
              </p>
              <AuthButtons />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
