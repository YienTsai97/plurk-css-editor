# Plurk CSS Editor — 系統架構文件

> 本文件為內部開發參考。2026-09 起，重要架構變更會隨對應程式碼提交。

## 1. 系統總覽

```
┌─────────────────────────────────────────────────────────┐
│                       Client (Browser)                  │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Editor   │  │  Preview     │  │  Dashboard /      │  │
│  │ Controls │  │  Components  │  │  Template Browse  │  │
│  └────┬─────┘  └──────┬───────┘  └────────┬──────────┘  │
│       │               │                   │             │
│       └───────┬───────┘                   │             │
│               ▼                           │             │
│       ┌───────────────┐                   │             │
│       │ StyleManager  │ (Zustand Store)   │             │
│       │ + CSS Var     │                   │             │
│       └───────┬───────┘                   │             │
│               │                           │             │
└───────────────┼───────────────────────────┼─────────────┘
                │  REST API (Next.js Route) │
                ▼                           ▼
        ┌───────────────────────────────────────┐
        │          Service Layer                │
        │  (project / template / auth / asset)  │
        └──────────────┬────────────────────────┘
                       │  Prisma ORM
                       ▼
        ┌──────────────────────────┐
        │   PostgreSQL (Supabase)  │
        │   + Supabase Storage     │
        └──────────────────────────┘
```

## 2. 技術堆疊明細

| 分類 | 技術 | 版本 | 用途 |
| --- | --- | --- | --- |
| 框架 | Next.js (App Router) | 15.x | SSR / API Routes / 路由 |
| UI | React | 19.x | 元件渲染 |
| 語言 | TypeScript | 5.x | 型別安全 |
| 狀態管理 | Zustand | 5.x | 前端狀態（StyleManager） |
| ORM | Prisma | 6.x | 資料庫存取 |
| 資料庫 | PostgreSQL | — | 持久化儲存 |
| 驗證 | NextAuth.js | 5 beta | OAuth / Session |
| CSS 框架 | Tailwind CSS | 4.x | 樣式開發 |
| UI 元件庫 | Radix UI | — | Dialog、Popover、ContextMenu 等 |
| 圖示 | Lucide React + 專案 SVG | 0.540 | 編輯器 UI 與本地預覽圖示 |
| 色彩選擇 | react-color | 2.19 | Color Picker |
| 檔案儲存 | Supabase Storage | — | 圖片 / 素材上傳 |

## 3. 資料庫設計（Prisma Schema）

### 3.1 核心 Model 關係圖

```
User ──┬── Project ──── ProjectAsset ──── Asset
       │        └── importedFromTemplate ──┐
       │                                   │
       ├── StyleTemplate ── StyleTemplateAsset ── Asset
       │        └── StyleTemplateCategory ── Category
       │
       ├── Like   (polymorphic: PROJECT | TEMPLATE)
       └── Star   (polymorphic: PROJECT | TEMPLATE)
```

### 3.2 關鍵 Model 摘要

| Model | 核心欄位 | 說明 |
| --- | --- | --- |
| **User** | email, name, image, locale | 使用者帳號 |
| **Project** | cssContent, visibility, slug, thumbnailUrl, forkCount, likeCount | 使用者的 CSS 專案 |
| **StyleTemplate** | cssContent, visibility, slug, isOfficial, forkCount, likeCount | 公共樣式模板 |
| **Category** | name, description | 模板分類標籤 |
| **Asset** | provider, bucket, key, url, mime, size | 上傳素材（圖片等） |
| **Like / Star** | targetType (PROJECT \| TEMPLATE), targetId | 多型態社群互動 |

### 3.3 可見度 Enum

```
Visibility: PRIVATE | UNLISTED | PUBLIC
```

- `PRIVATE`：僅本人可見
- `UNLISTED`：知道連結者可見，不出現在搜尋
- `PUBLIC`：所有人可見

## 4. 前端架構

### 4.1 頁面路由

| 路徑 | 說明 | 驗證需求 |
| --- | --- | --- |
| `/` | Landing Page | 無 |
| `/auth/signin` | 登入頁 | 無 |
| `/editor` | 公開編輯器（Flow A） | 無 |
| `/about` | 非官方聲明與素材／版權說明 | 無 |
| `/editor/[id]` | 專案編輯器（Flow B）| 需登入 |
| `/dashboard` | 使用者總覽 | 需登入 |
| `/dashboard/projects` | 專案管理 | 需登入 |
| `/projects` | 公開專案瀏覽 | 無 |
| `/templates` | 模板瀏覽頁 | 無 |

### 4.2 元件架構

```
components/
├── editor/               # 編輯器專屬
│   ├── public-editor-header   # 公開編輯器頂部（Flow A）
│   ├── editor-context-menu    # 編輯器右鍵選單共用外殼與 row/section 元件
│   ├── editor-io-dock         # 右下匯入／匯出／回復／儲存入口
│   └── save-project-button    # 本地／線上專案儲存 Dialog
│
├── controllers/          # 編輯器控制器
│   ├── color-picker           # 色彩選擇器
│   ├── border-editor          # 邊框樣式；寬度使用 NumberSliderControl
│   ├── number-slider-control  # 數值型樣式共用 slider（可設定 min/max/step/unit）
│   └── ImageUploader          # 圖片上傳 / 外連背景圖
│
├── preview/              # Plurk 模擬預覽元件
│   ├── plurk-top-bar          # 導覽列
│   ├── plurk-dashboard/       # 個人頁（左側資訊 + 右側統計）
│   ├── plurk-timeline/        # 時間軸（控制列 + 貼文列表）
│   │   ├── response-count/     # 回應數徽章 feature module（selector/menu/styles/default）
│   │   └── timeline-background/# 河道/body 背景 feature module（menu/styles/ImageUploader wrapper）
│   ├── plurk-post/            # 單則貼文（含 styles + manager actions）
│   │   ├── manager/
│   │   │   ├── icon-state.type        # manager icon 共用型別（on/off + onToggle）
│   │   │   ├── mute-icon              # 靜音圖示元件
│   │   │   ├── like-icon              # 愛心圖示元件（含顯示數字）
│   │   │   ├── replurk-icon           # 轉噗圖示元件（含顯示數字）
│   │   │   └── use-manager-icon-toggle # icon toggle + count state hook
│   │   ├── plurk-post-appearance/     # 貼文外觀 feature module（.plurk_cnt / .name）
│   │   ├── plurk-post-context-menu-content # 貼文右鍵選單組裝器
│   │   ├── plurk-post.types           # PostData / PostThread 型別
│   │   ├── plurk-post.styles          # 主貼文 / manager / response-box 固定預覽樣式
│   │   ├── plurk-response-box         # 展開回應區塊元件
│   │   └── plurk-post                 # 單則貼文主體
│   ├── plurk-footer           # 頁尾
│   └── common/
│       ├── css-import         # CSS 匯入 Dialog 與 parser 結果提示
│       ├── export-button      # CSS 匯出 Dialog
│       └── preview-icons      # 本地 inline SVG 預覽圖示
│
└── ui/                   # 通用 UI 元件（Radix 封裝）
    ├── context-menu
    ├── dialog
    ├── popover
    ├── slider
    └── input
```

### 4.3 StyleManager（核心狀態引擎）

StyleManager 是整個編輯器的核心，負責管理所有 CSS 屬性的值、來源與優先級。

**儲存結構：**

```typescript
type StyleManagerState = {
  current: StyleDict          // 當前生效值
  initial: StyleDict          // 元件初始註冊值
  styleSources: Record<…>    // 每個屬性的來源標記
  allStyles: Map<…>          // 所有變更（含時間戳）
}
```

**樣式來源優先級（高 → 低）：**

1. `manual` — 使用者手動調整
2. `imported` — 從外部 CSS 匯入
3. `registered` — 元件初始值

**核心操作：**

| 方法 | 說明 |
| --- | --- |
| `setInitialBatch` | 元件掛載時批次註冊初始樣式 |
| `setProp` | 使用者手動修改單一屬性（標記為 manual） |
| `importCSS` | 接收已解析規則，寫入 imported 狀態並注入 `<style id="imported-css-styles">` |
| `replaceImportedCSS` | 先清除上一輪 imported，再套用整份新規則，避免 DOM 與 store 殘留不同步 |
| `setCSSVariable` | 透過 CSS Custom Properties 高效覆蓋 |
| `clearImportedCSS` | 清除所有 imported 樣式 |
| `resetImportedToInitial` | 清除 imported 並回復初始值 |
| `resetAllToInitial` | 清除 imported 與 manual，將所有 selector 還原成 registered 初始值 |
| `getAllStyles` | 匯出 CSS 字串（排除 registered，含來源標記） |

**效能優化：**

- Zustand `shallow` 比對防止不必要的 re-render
- `useStyleProp` hook 訂閱單一屬性，避免全域更新
- CSS Variables 直接操作 `document.documentElement`，跳過 React 渲染週期

### 4.4 Editor I/O Dock 與 Dialog 流程

`EditorIoDock` 是 `/editor` 右下角的單一操作入口。滑入「✏️ 輸入／輸出」後向上展開四項功能，選中功能時先收合 Dock，再開啟獨立的置中 Dialog。

| 功能 | 元件 | 行為 |
| --- | --- | --- |
| 匯入 CSS | `css-import.tsx` | textarea 保留原文；確認時以 `replaceImportedCSS` 整批替換 imported 層 |
| 回復為初始模板 | `editor-io-dock.tsx` | `resetAllToInitial` 清除匯入與右鍵手動樣式，並清除草稿 |
| 匯出 CSS | `export-button.tsx` | 開窗後才選擇複製、下載或建立分享連結，不在 Dock 點擊時直接執行 |
| 儲存專案 | `save-project-button.tsx` | 未登入可存本地；線上儲存需登入；無變更時按鈕停用 |

所有 Dialog 共用 `src/components/ui/dialog.tsx`：遮罩位於預覽之上，點遮罩不關閉，使用右上角關閉鈕或 `Esc` 離開。

**匯入資料流：**

```
textarea 原文
  → analyzeImportedCss() 解析與差異提示
  → 使用者按「確認輸入」
  → replaceImportedCSS(rules)
  → 清除舊 imported 狀態 / style tag / CSS variables
  → 寫入新 imported 狀態與 #imported-css-styles
```

**草稿與還原：**

- `plurk-css-editor-draft`：每 30 秒保存目前可匯出的樣式。
- `plurk-css-editor-imported-source`：保存最後一次確認匯入的 textarea 原文。
- 回復初始模板會刪除兩者，並略過一次自動寫回，避免舊草稿復活。

### 4.5 預覽素材本地化與頂欄層級

- 頂欄、貼文管理器與回應操作圖示改用 `preview-icons.tsx` 的 inline SVG。
- 頭貼、badge、coin、吉祥物與 Logo 位於 `public/`，預覽不再依賴 Plurk 圖片 CDN。
- `next.config.ts` 已移除未使用的 Plurk 圖片網域。
- `/about` 說明本站為非官方工具，middleware 在 editor-only 模式下仍允許存取。
- `#top_bar` 使用 sticky 與獨立層級；背景色條不接收 pointer event，避免內容層透明區域擋住連結。

### 4.6 Style Feature Module

為了支援後續更複雜的 CSS target 編輯，預覽區的可編輯樣式逐步改成 feature module 管理。

**核心原則：**

- `constants`：集中 selector 與可編輯屬性規格。
- `menu`：負責右鍵選單 UI，透過 `useStyleProp()` 讀寫 StyleManager。
- `styles`：常駐註冊 defaults，並輸出高權重預覽 CSS。
- `wrapper`：只有在 feature 需要長期 UI state 時使用，例如河道背景的 `ImageUploader` dialog。

**目前已拆分：**

| Feature | 位置 | 實際 selector | 說明 |
| --- | --- | --- | --- |
| 貼文外觀 | `src/components/preview/plurk-post/plurk-post-appearance/` | `.plurk_cnt`, `.name` | 貼文背景色、背景圖、邊框、暱稱色預覽覆寫 |
| 河道背景 | `src/components/preview/plurk-timeline/timeline-background/` | `body` | UI 顯示為河道背景；為相容既有草稿與匯出仍使用 `body` |
| 回應數徽章 | `src/components/preview/plurk-timeline/response-count/` | `.timeline-cnt .response_count`, `.timeline-cnt .new .response_count` | 已讀/未讀徽章顏色與共通圓角；圓角使用百分比 slider |

**資料流：**

```
FeatureMenu
  → useStyleProp(selector, prop).set(value)
  → StyleManager current/allStyles
  → FeatureStyles 產生預覽 CSS
  → getAllStyles() 匯出 CSS
```

父層元件只負責掛載 feature，不再直接知道每個 selector 的細節。例如 `/editor` 只掛 `TimelineBackground`，`PlurkPost` 只掛 `PlurkPostAppearanceStyles`。

**數值型控制器規則：**

- 涉及寬度、圓角、透明度、字級等可連續調整的數值，優先使用 `NumberSliderControl`。
- 各 feature / controller 自行傳入 `max`、`step`、`unit`，避免所有數值共用不合理範圍。
- 目前 response count 圓角使用 `%`（0–50），BorderEditor 寬度依單位調整上限（例如 px、em/rem、%）。

### 4.7 Plurk Post manager 行為

`plurk-post` 內的 manager 操作列已拆分為 icon 元件 + hook，避免 `plurk-post.tsx` 過度膨脹。

**互動責任分工：**

- `mute-icon`：只處理靜音 icon on/off 顯示與點擊事件傳遞。
- `like-icon` / `replurk-icon`：處理 icon on/off 與數字渲染（`displayCount`）。
- `useManagerIconToggle`：
  - 管理 `state: "on" | "off"`、`isOn`、`toggle`
  - 提供 `useManagerIconToggleWithCount`，同時處理數字 state（+1 / -1）與 icon 開關同步。

**資料模型（PostData）新增欄位：**

- `muteState: "on" | "off"`
- `likeState: "on" | "off"`
- `likeCount?: number`
- `replurkState: "on" | "off"`
- `replurkCount?: number`

**目前範圍：**

- 上述互動為前端預覽行為（local state），尚未串接後端持久化 API。

## 5. 後端架構

### 5.1 API Routes

| 路徑 | 方法 | 說明 |
| --- | --- | --- |
| `/api/auth/[...nextauth]` | * | NextAuth.js 驗證端點 |
| `/api/projects` | GET, POST | 專案列表 / 建立 |
| `/api/projects/[id]` | GET, PUT, DELETE | 單一專案 CRUD |
| `/api/templates` | GET, POST | 模板列表 / 建立 |
| `/api/templates/[id]` | GET, PUT, DELETE | 單一模板 CRUD |
| `/api/assets` | GET, POST | 素材列表 / 上傳 |
| `/api/assets/[id]` | GET, DELETE | 單一素材操作 |
| `/api/fork` | POST | Fork 模板為新專案 |

### 5.2 Service Layer

```
services/
├── auth.service.ts              # 驗證與 Session 管理
├── project.service.ts           # 專案 CRUD + 權限檢查
├── template.service.ts          # 模板 CRUD
├── style-template.service.ts    # 模板進階操作（分類、搜尋）
├── fork.service.ts              # Fork 流程
└── user.service.ts              # 使用者 Profile
```

所有 Service 回傳統一格式：

```typescript
type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: any
}
```

### 5.3 驗證與權限

- **Middleware**（`src/middleware.ts`）：攔截需要登入的路由
- **Session**：NextAuth.js Session，伺服器端透過 `auth()` 取得
- **資料隔離**：Service 層檢查 `userId` 確保使用者只能操作自己的資料

## 6. 使用者流程（User Flow）

### Flow A：公開編輯器（未登入 / 匿名）

```
進入 /editor
  → 在編輯器中調整樣式
  → 右下「輸入／輸出」
      ├─ 匯入 CSS（整批替換上一輪匯入）
      ├─ 回復為初始模板
      ├─ 匯出 CSS（複製／下載／分享連結）
      └─ 儲存專案
           ├─ 未登入 → 本地儲存
           └─ 已登入 → 本地或線上儲存
```

### Flow B：專案 / 模板編輯器（已登入）

```
進入 /editor/[id]（從 Dashboard 或 Template 頁面）
  → 檢查 DB 中 cssContent 是否為空
      ├─ 不為空 → 彈出選擇：是否匯入模板？
      │     ├─ 是 → 選擇模板匯入到 import 欄位
      │     └─ 否 → 直接進入編輯
      └─ 為空 → 直接進入編輯
  → 在編輯器中調整樣式
  → 匯出 CSS
  → 儲存到 DB（更新 Project 或 Template 的 cssContent）
```

## 7. 基礎設施

| 服務 | 用途 |
| --- | --- |
| Supabase | PostgreSQL 資料庫 + Storage（圖片） |
| Vercel（預計） | Next.js 部署 |
| GitHub | 版本控制 |

## 8. 開發環境

```bash
npm run dev              # 開發伺服器（Turbopack）
npm run db:studio        # Prisma Studio（DB GUI）
npm run db:migrate:dev   # 執行 Migration
npm run db:seed          # 匯入種子資料
npm run lint             # ESLint 檢查
```
