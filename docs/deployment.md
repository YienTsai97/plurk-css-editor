# 部署指南 — Vercel Production

> 內部參考。紀錄 2026-08 首次 soft launch（公開編輯器優先上線）的部署決策、環境變數與驗收重點。
>
> 相關文件：[editor-only-mode-and-preview-layout.md](./issue-records/editor-only-mode-and-preview-layout.md)

---

## 1. 部署概覽

| 項目 | 選擇 |
| --- | --- |
| 平台 | **Vercel**（Next.js 原生支援；Git push 自動部署） |
| 版控 | GitHub `YienTsai97/plurk-css-editor`，分支 `main` |
| 上線策略 | **Editor-only soft launch**：Production 設 `EDITOR_ONLY_MODE=true` |
| 對外入口 | `/editor`（首頁 `/` 自動導向編輯器） |
| 資料庫 / 素材 | Supabase（PostgreSQL + Storage，已託管，無需隨 app 一起部署） |

曾評估 Zeabur，因 Next.js 專案在 Vercel 設定較少、不需先購買伺服器，最終採 Vercel。

---

## 2. Vercel 專案設定

### 2.1 Import 與 Build

- **Framework Preset**：Next.js（自動偵測）
- **Root Directory**：`./`
- **Build Command**：`npm run build`（預設）
- **Install**：`npm install` 會觸發 `postinstall` → `prisma generate`

無需自訂 `output: 'export'`；本專案為全端 Next.js（API routes、middleware、NextAuth）。

### 2.2 環境變數（Environment）

多數 secret 建議選 **Production and Preview**。
`AUTH_URL` 僅 **Production** 填正式網域（Preview 網址每次不同，OAuth 難逐一登記）。

| 變數 | 必填 | 說明 |
| --- | --- | --- |
| `EDITOR_ONLY_MODE` | ✅ | Production 設 `true` 啟用 soft launch |
| `AUTH_URL` | ✅ | 正式站網址，例：`https://<project>.vercel.app` |
| `AUTH_TRUST_HOST` | ✅ | Vercel 反向代理環境設 `true` |
| `AUTH_SECRET` | ✅ | Session 加密 |
| `AUTH_GOOGLE_ID` | ✅ | Google OAuth **網頁應用程式** Client ID |
| `AUTH_GOOGLE_SECRET` | ✅ | 對應 Client Secret |
| `DATABASE_URL` | ✅ | Supabase Transaction Pooler（`:6543` + `pgbouncer=true`） |
| `DIRECT_URL` | ✅ | Supabase Direct（migration 用；runtime 主要用 `DATABASE_URL`） |
| `SUPABASE_URL` | ✅ | Supabase 專案 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | 後端 Storage CRUD（勿暴露到 client） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⬜ | 若前端需直接存取 Supabase |

**不要**在 Vercel 設定 `NODE_ENV=development`（平台會自動設 `production`）。

### 2.3 NextAuth v5 環境變數命名

本專案使用 **NextAuth v5（Auth.js）**：

- 使用 **`AUTH_URL`**，**不必**保留 v4 的 `NEXTAUTH_URL`
- 部署拿到 Vercel 網域後，將 `AUTH_URL` 改為正式 URL 並 **Redeploy** 一次

---

## 3. Google OAuth 設定

### 3.1 用戶端類型

必須建立 **「網頁應用程式」（Web application）** 類型的 OAuth 2.0 Client ID。

「電腦」（Desktop）類型 **沒有**「已授權的重新導向 URI」欄位，無法給 NextAuth 使用。

路徑：**Google Cloud Console → API 和服務 → 憑證 → OAuth 2.0 用戶端 ID → 編輯**

### 3.2 要新增的 URI

**已授權的重新導向 URI**（Authorized redirect URIs）：

```text
http://localhost:3000/api/auth/callback/google
https://<your-vercel-domain>.vercel.app/api/auth/callback/google
```

**已授權的 JavaScript 來源**（建議）：

```text
http://localhost:3000
https://<your-vercel-domain>.vercel.app
```

自訂網域上線後，需再各加一條對應網域的 URI，並更新 Vercel 的 `AUTH_URL`。

### 3.3 Callback 用意

Google 登入完成後，只會導回白名單內的 URL。NextAuth 固定接收路徑：

```text
/api/auth/callback/google
```

未登記 → `redirect_uri_mismatch` 錯誤。

---

## 4. Editor-only soft launch 行為

由 [`src/middleware.ts`](../src/middleware.ts) 與 `EDITOR_ONLY_MODE` 控制。

| 路徑 | Production 行為 |
| --- | --- |
| `/` | 307 → `/editor` |
| `/editor` | 正常（公開，免登入） |
| `/about` | 正常（非官方／版權聲明） |
| `/templates`、`/dashboard`、`/projects` 等 | 307 → `/under-construction` |
| `/under-construction` | 建置中頁（含「前往公開編輯器」連結） |

**Allowlist**（middleware 放行）：`/editor`、`/about`、`/under-construction`、`/api/auth`，以及符合圖片副檔名規則的 `public/` 預覽素材。頂欄已使用本地 inline SVG，不再依賴 `/testicon` 或 `/plurk-icon.svg`。

**注意**：matcher 排除 `/api/*`，soft launch 期間非 editor 相關 API 仍可被直接呼叫。若需更嚴格，需後續調整 matcher。

---

## 5. 部署後驗收清單

- [ ] `https://<domain>/` 導向 `/editor`
- [ ] `/editor` 載入、即時預覽、localStorage 草稿正常
- [ ] 右鍵選單（貼文外觀、河道背景、回應數徽章）可操作
- [ ] 公開圖庫 `/api/assets/public` 可載入
- [ ] 右下「輸入／輸出」Dock 可開啟匯入、匯出、回復與儲存 Dialog
- [ ] 匯入 CSS 可整批替換上一輪 imported；ignored／實際匯入提示正確
- [ ] 匯出複製、下載與分享連結 `?import=` 正常
- [ ] 回復初始模板後 imported、manual 與草稿均清除，30 秒後不復活
- [ ] 頂欄 icon 不破圖且 `/about` 連結可點擊
- [ ] `/templates`、`/dashboard` 導向建置中頁
- [ ] Google 登入（若測試）：callback 無 `redirect_uri_mismatch`

---

## 6. 已知限制（本次 release）

1. **登入後 redirect**：`auth-buttons` 的 `callbackUrl` 預設 `/dashboard`；editor-only 下會再被導向建置中頁。不影響免登入使用 `/editor`。
2. **Dashboard / Templates 未開放**：需將 `EDITOR_ONLY_MODE` 改 `false` 並 redeploy 後才恢復。
3. **Preview 部署**：若 env 含 `EDITOR_ONLY_MODE=true`，Preview 同樣會擋非 editor 路徑；OAuth 在 Preview 通常不測。

---

## 7. 全站開放時

1. Vercel 將 `EDITOR_ONLY_MODE` 改 `false`（或移除）
2. Redeploy Production
3. 驗證 `/dashboard` 登入保護、模板頁、專案 API

---

## 8. 常用連結

| 用途 | URL |
| --- | --- |
| Vercel Dashboard | https://vercel.com/dashboard |
| Google Cloud Credentials | https://console.cloud.google.com/apis/credentials |
| Supabase Dashboard | https://supabase.com/dashboard |

---

## 9. 變更紀錄

| 日期 | 說明 |
| --- | --- |
| 2026-08-10 | 首次 Vercel Production 部署；editor-only soft launch |
