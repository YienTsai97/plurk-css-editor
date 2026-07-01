# Plurk CSS Editor — 系統架構文件

> 本文件為內部開發參考，不納入 Git 版控。

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
| UI 元件庫 | Radix UI | — | Popover、ContextMenu 等 |
| 圖示 | Lucide React | 0.540 | SVG Icon |
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
| `/editor/[id]` | 專案編輯器（Flow B）| 需登入 |
| `/dashboard` | 使用者總覽 | 需登入 |
| `/dashboard/projects` | 專案管理 | 需登入 |
| `/projects` | 公開專案瀏覽 | 無 |
| `/templates` | 模板瀏覽頁 | 無 |

### 4.2 元件架構

```
components/
├── controllers/          # 互動控制元件
│   ├── color-picker      # 色彩選擇器（react-color 封裝）
│   ├── border-editor     # 邊框粗細 / 圓角 / 樣式
│   └── ImageUploader     # 圖片上傳元件
│
├── editor/               # 編輯器專屬
│   ├── public-editor-header   # 公開編輯器頂部（Flow A）
│   ├── editor-context-menu    # 編輯器右鍵選單共用外殼與 row/section 元件
│   └── save-project-button    # 儲存 / 建立專案按鈕
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
│       ├── css-import         # CSS 匯入介面
│       └── export-button      # CSS 匯出按鈕
│
└── ui/                   # 通用 UI 元件（Radix 封裝）
    ├── context-menu
    ├── popover
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
| `importCSS` | 解析並匯入外部 CSS，注入 `<style>` 到 DOM |
| `setCSSVariable` | 透過 CSS Custom Properties 高效覆蓋 |
| `clearImportedCSS` | 清除所有 imported 樣式 |
| `resetImportedToInitial` | 清除 imported 並回復初始值 |
| `getAllStyles` | 匯出 CSS 字串（排除 registered，含來源標記） |

**效能優化：**

- Zustand `shallow` 比對防止不必要的 re-render
- `useStyleProp` hook 訂閱單一屬性，避免全域更新
- CSS Variables 直接操作 `document.documentElement`，跳過 React 渲染週期

### 4.4 Style Feature Module（新增）

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
| 回應數徽章 | `src/components/preview/plurk-timeline/response-count/` | `.timeline-cnt .response_count`, `.timeline-cnt .new .response_count` | 已讀/未讀徽章顏色與共通圓角 |

**資料流：**

```
FeatureMenu
  → useStyleProp(selector, prop).set(value)
  → StyleManager current/allStyles
  → FeatureStyles 產生預覽 CSS
  → getAllStyles() 匯出 CSS
```

父層元件只負責掛載 feature，不再直接知道每個 selector 的細節。例如 `/editor` 只掛 `TimelineBackground`，`PlurkPost` 只掛 `PlurkPostAppearanceStyles`。

### 4.5 Plurk Post manager 行為（新增）

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
  → 匯出 CSS
  → 選擇：
      ├─ 複製 CSS 字串（直接使用）
      └─ 建立專案 / 模板
           ├─ 已登入 → 直接儲存到 DB
           └─ 未登入 → 導向登入 → 登入後自動建立
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
