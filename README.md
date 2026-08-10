# Plurk CSS Editor

一款專為 [Plurk](https://www.plurk.com/) 平台設計的視覺化 CSS 編輯器，讓使用者透過即時預覽介面自訂個人頁面樣式，無需手寫 CSS。

## 功能特色

- **即時預覽** — 模擬 Plurk 的 Dashboard、Timeline、Post、Footer 等元件，調整樣式後立即反映
- **CSS 匯入 / 匯出** — 貼上既有 CSS 即可匯入；編輯完成後一鍵匯出可直接套用的 CSS 字串
- **專案管理** — 建立、編輯、刪除個人專案；支援公開 / 不公開 / 非公開連結三種可見度
- **樣式模板** — 瀏覽社群分享的模板，Fork 到自己的專案繼續客製
- **圖片素材管理** — 上傳背景圖等素材並套用到樣式中
- **帳號驗證** — 透過 NextAuth.js 登入，資料安全儲存於雲端資料庫

## 技術架構

| 層級 | 技術 |
| --- | --- |
| 框架 | Next.js 15 (App Router) + React 19 |
| 語言 | TypeScript 5 |
| 狀態管理 | Zustand 5 (自製 StyleManager) |
| 資料庫 | PostgreSQL — Prisma ORM 6 |
| 驗證 | NextAuth.js 5 |
| 樣式 | Tailwind CSS 4 |
| UI 元件 | Radix UI + Lucide Icons |
| 儲存空間 | Supabase Storage |

## 快速開始

### 前置需求

- Node.js ≥ 18
- PostgreSQL 資料庫（可使用 Supabase）

### 安裝

```bash
git clone https://github.com/YienTsai97/plurk-css-editor.git
cd plurk-css-editor
npm install
```

### 環境變數

在專案根目錄建立 `.env` 檔案：

```env
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-database-url"
AUTH_SECRET="your-auth-secret"
```

### 資料庫初始化

```bash
npm run db:migrate:dev
npm run db:generate
npm run db:seed          # 選用：匯入範例資料
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 即可使用。

## 專案結構

```
├── prisma/              # Prisma schema 與 migration 檔案
├── public/              # 靜態資源（icon、圖片）
├── src/
│   ├── app/             # Next.js App Router 頁面與 API Routes
│   ├── components/      # React 元件
│   │   ├── controllers/ # 色彩選擇器、邊框編輯器等互動控制元件
│   │   ├── editor/      # 編輯器 Header、儲存按鈕等
│   │   ├── preview/     # Plurk 模擬預覽元件（Dashboard、Timeline、Post …）
│   │   └── ui/          # 通用 UI 元件（Popover、ContextMenu、Input）
│   ├── lib/             # 資料庫連線、工具函式
│   ├── services/        # 商業邏輯 Service 層（Project、Template、Auth …）
│   ├── store/           # Zustand Store（StyleManager、BackgroundEditor）
│   ├── types/           # TypeScript 型別定義
│   └── utils/           # 工具函式（CSS 解析、邊框計算）
├── package.json
└── tsconfig.json
```

## 可用指令

| 指令 | 說明 |
| --- | --- |
| `npm run dev` | 啟動開發伺服器（Turbopack） |
| `npm run build` | 建置正式版 |
| `npm run start` | 啟動正式伺服器 |
| `npm run lint` | ESLint 程式碼檢查 |
| `npm run db:studio` | 開啟 Prisma Studio（資料庫 GUI） |
| `npm run db:migrate:dev` | 執行資料庫 Migration |
| `npm run db:seed` | 匯入種子資料 |

## 授權

本專案為私人專案，未授權公開使用。
