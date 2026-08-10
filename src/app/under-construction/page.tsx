import Link from "next/link";

export default function UnderConstructionPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">🚧</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">建置中</h1>
        <p className="text-gray-600 mb-8">
          專案管理、模板庫等功能尚在開發中，敬請期待。
        </p>
        <Link
          href="/editor"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          前往公開編輯器 →
        </Link>
      </div>
    </main>
  );
}