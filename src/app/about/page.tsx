import Link from "next/link";

export const metadata = {
  title: "關於與版權聲明 | Plurk Styler",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f7fb] text-[#222]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="mb-6">
          <Link href="/editor" className="text-[#FF574D] hover:underline">
            ← 回到編輯器
          </Link>
        </p>

        <h1 className="mb-2 text-3xl font-bold">關於 Plurk Styler</h1>
        <p className="mb-8 text-sm text-[#666]">最後更新：2026 年 9 月</p>

        <section className="mb-8 space-y-3 rounded-xl border border-[#ececf3] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">這是什麼</h2>
          <p className="leading-relaxed text-[#444]">
            <strong>Plurk Styler</strong> 協助使用者在噗浪上編寫與預覽自訂 CSS。
            介面中的河道、貼文、儀表板等區塊僅為<strong>樣式編輯用的模擬預覽</strong>，方便對照 selector 與視覺效果。
          </p>
        </section>

        <section className="mb-8 space-y-3 rounded-xl border border-[#ececf3] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">非官方聲明</h2>
          <ul className="list-disc space-y-2 pl-5 leading-relaxed text-[#444]">
            <li>本網站<strong>與 Plurk 無官方關係</strong>，未獲 Plurk 授權或背書。</li>
            <li>本工具所提及之「Plurk」及「噗浪」均為 Plurk, Inc. 之商標。本服務僅供使用者個人樣式設定與編輯參考。</li>
            <li>預覽區圖示、吉祥物等為<strong>自製簡化 SVG</strong>，非 Plurk 官方素材。</li>
          </ul>
        </section>

        <section className="mb-8 space-y-3 rounded-xl border border-[#ececf3] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">智慧財產與使用範圍</h2>
          <ul className="list-disc space-y-2 pl-5 leading-relaxed text-[#444]">
            <li>請勿將本工具誤認為 Plurk 官方服務，或暗示與 Plurk 有合作關係。</li>
            <li>使用者匯出的 CSS 由使用者自行貼至 Plurk，並須遵守 Plurk 服務條款。</li>
            <li>本工具目前以非營利、個人／社群用途為主；公開名稱為 <strong>Plurk Styler</strong>，功能與授權條款可能隨開發調整。</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border border-[#ececf3] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">聯絡</h2>
          <p className="leading-relaxed text-[#444]">
            若對版權、商標或內容有疑慮，請透過專案維護者管道聯繫，我們會盡快處理。
          </p>
        </section>
      </div>
    </main>
  );
}
