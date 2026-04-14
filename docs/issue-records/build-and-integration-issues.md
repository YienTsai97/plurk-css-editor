# 建置與整合問題紀錄

> 彙整一次除錯過程中出現的錯誤／警告與對應處理，供日後參照。  
> 環境參考：Next.js 15（App Router、Turbopack dev）、Prisma 6、NextAuth 5 beta。

---

## 1. `Module not found: Can't resolve '@/generated/prisma'`

**徵兆**

- Build 或 dev 時報無法解析 `@/generated/prisma`。
- `tsconfig` 將 `@/*` 對應到 `./src/*`，因此路徑應為 `src/generated/prisma`。

**原因**

- `prisma/schema.prisma` 的 `generator client` 將輸出設在 `../src/generated/prisma`。
- 該目錄在 `.gitignore` 中（不會進版控），新 clone 或尚未執行 generate 時資料夾不存在。

**處理**

- 執行 `npm run db:generate`（或 `npx prisma generate`）。
- 在 `package.json` 增加 `postinstall: prisma generate`，讓 `npm install` 後自動產生 client。

**避免遺漏**

- README／onboarding 流程應包含「安裝依賴後會自動 generate」或手動指令說明。

---

## 2. Edge Middleware 與 Prisma／Node API 警告或錯誤

**徵兆**

- Build 出現 Edge Runtime 不支援 `setImmediate`、`CompressionStream` 等警告。
- Import trace 顯示：`middleware` → `auth` → `auth.service` → `user.service` → `db` → Prisma。

**原因**

- 先理解執行環境差異：
  - `middleware` 跑在 **Edge Runtime**（比較像瀏覽器／Web Worker 環境）。
  - Prisma Client 需要 **Node.js Runtime**（會用到 Node API）。
  - 所以「Edge 直接或間接載入 Prisma」就會出現警告，嚴重時可能直接壞掉。
- 問題通常不是你在 middleware 直接 `import prisma`，而是 **間接依賴鏈**：
  - `middleware` 引用 `auth.ts`
  - `auth.ts` 又引用 `auth.service.ts`
  - `auth.service.ts` 再引用 `user.service.ts`
  - `user.service.ts` 使用 `db.ts`（內含 Prisma Client）
  - 最後 Prisma 被打進 Edge bundle。
- `auth.ts` 若同時放了「純設定」和「需要資料庫的 callbacks（例如 `signIn` 裡查 DB）」，
  middleware 一引用 `auth.ts`，整包就被拉進來，這是最常見地雷。

**處理**

- 將 **僅設定**（providers、pages、session、secret）抽到 `auth.config.ts`（或同等 `NextAuthConfig`）。
- `middleware` 使用 `NextAuth(authConfig)` 產生的輕量 `auth`，不要從完整 `auth.ts` 匯入會連到 DB 的程式。
- 需要查資料庫的邏輯留在 Route Handler／Server Actions／Node runtime。

**新手可照做步驟（建議順序）**

1. 先建立 `auth.config.ts`，只放「不碰資料庫」的內容：
   - providers
   - pages
   - session strategy
   - secret
2. 在 `middleware.ts` 改成用 `NextAuth(authConfig)`，並只做路徑保護／導頁判斷。
3. `auth.ts` 再去擴充 callbacks、DB 檢查、使用者同步等「需要 Prisma」邏輯。
4. 重新 `npm run build`，確認 Import trace 不再從 middleware 串到 Prisma。

**判斷是否修好**

- 好現象：build 不再出現 `wasm-engine-edge`、`setImmediate` 這類由 Prisma runtime 引發的 Edge 警告。
- 若仍有警告：用錯誤訊息中的 Import trace 逐層往上找，直到找到哪個檔案把 DB 邏輯帶進 middleware。

**改前／改後（最小範例）**

改前（middleware 直接吃到完整 `auth.ts`，可能連 DB 一起打包進 Edge）：

```ts
// middleware.ts
import { auth } from "@/auth";

export default auth((req) => {
  // ...
});
```

```ts
// auth.ts（同檔同時有 provider 設定 + 會查 DB 的 callback）
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authGoogleSignIn } from "@/services/auth.service"; // 這條會一路連到 prisma

export const { auth } = NextAuth({
  providers: [Google(/* ... */)],
  callbacks: {
    async signIn({ user, account }) {
      return (await authGoogleSignIn(user, account)).success;
    },
  },
});
```

改後（把純設定抽離，middleware 只用不碰 DB 的 config）：

```ts
// auth.config.ts（只放純設定）
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const authConfig = {
  providers: [Google(/* ... */)],
  pages: { signIn: "/auth/signin" },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET!,
} satisfies NextAuthConfig;

export default authConfig;
```

```ts
// middleware.ts（Edge 安全）
import NextAuth from "next-auth";
import authConfig from "../auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // 只做路徑保護
});
```

---

## 3. Next.js 15：動態路由 `params` 型別與用法

**徵兆**

- `next build` 型別檢查報 `params` 與 `RouteContext` 不相容（例如期望 `Promise`）。

**原因**

- App Router 動態區段 `[id]` 的 `params` 在型別上為 **Promise**（需 `await`）。

**處理**

- Handler 第二參數改為 `{ params }: { params: Promise<{ id: string }> }`，並使用 `const { id } = await params`。

**改前／改後（精簡）**

改前（Next.js 15 會在型別檢查報錯）：

```ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;
  // ...
}
```

改後（符合 Next.js 15 動態路由型別）：

```ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  // ...
}
```

**適用檔案範例**

- `src/app/api/projects/[id]/route.ts`
- `src/app/api/templates/[id]/route.ts`
- 其他 `[param]` 路由需一併對齊。

---

## 4. Prisma：`Project` 與素材關聯名稱不符

**徵兆**

- `include: { assets: … }` 型別錯誤：`assets` 不是 `ProjectInclude` 的合法欄位。

**原因**

- 這個錯誤的核心是「你以為 `Project` 直接有 `assets` 關聯，但 schema 實際不是這樣」。
- 在目前 schema 設計中，`Project` 與 `Asset` 是透過中介表關聯（多對多）：
  - `Project` -> `ProjectAsset[]`（例如欄位名 `projectAssets`）
  - `ProjectAsset` -> `Asset`（例如欄位名 `asset`）
- Prisma Client 會**嚴格依 schema 產生型別**，因此：
  - 如果 `Project` model 沒有 `assets` 這個 relation field，
  - `include: { assets: ... }` 就一定會在 TS compile 時報錯。
- 簡單記法：先看 `schema.prisma` 上 `model Project` 真正有哪些 relation 欄位名，再寫 `include`。

**處理**

- 查詢改用 `projectAssets: { include: { asset: … } }` 等與 schema 一致的 include。
- 若 API 回傳格式仍需 `{ assets: [...] }`，在回傳前將 `projectAssets` map 成 `assets` 陣列即可。

**改前／改後（精簡）**

改前（錯誤寫法，`Project` 並沒有 `assets` relation）：

```ts
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    assets: {
      select: { id: true, url: true },
    },
  },
});
```

改後（對齊 schema 的中介關聯）：

```ts
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    projectAssets: {
      include: {
        asset: {
          select: { id: true, url: true },
        },
      },
    },
  },
});
```

如果前端既有介面仍吃 `assets`，可在 API 回傳前轉一次：

```ts
const projectWithAssets = {
  ...project,
  assets: project.projectAssets.map((pa) => pa.asset),
};

return NextResponse.json({ success: true, data: projectWithAssets });
```

**新手檢查清單**

1. 打開 `prisma/schema.prisma`，確認 `model Project` 的 relation 欄位名稱。
2. 在 TS 檔案寫 `include` 時，欄位名要與 schema 完全一致（大小寫也要一致）。
3. 若關聯是中介表（`ProjectAsset`），就要 include 到中介層，再 include 目標表（`asset`）。
4. 若要維持舊 API 格式，不要硬改 Prisma relation 名稱，改在 response 層做 mapping。

---

## 5. Zustand：`StyleManagerState` 與 slice 不一致

**徵兆**

- `resetAll` 等屬性存在於 slice，但 `StyleManagerState` 型別未宣告，導致 TS 錯誤。

**原因（新手版）**

- Zustand 常見寫法是把 store 拆成多個 slice（`core` / `import` / `export`）。
- 但 TypeScript 只看「你宣告的狀態型別」：
  - 若 slice 裡實作了 `resetAll`，
  - `StyleManagerState` 卻沒定義 `resetAll`，
  - TS 會認為「你回傳了不屬於 state 的欄位」。
- 另外常見第二層問題是：每個 slice 都回傳 `Partial<StyleManagerState>`，
  在最後 merge 時 TS 會看到很多可選欄位（`undefined` 可能），再與完整 state 產生衝突。

**處理**

- 在 `types.ts` 的 `StyleManagerState` 補上對應方法／欄位，或調整 slice 回傳型別與 `createWithEqualityFn` 泛型一致。

**改前／改後（精簡）**

改前（型別缺方法）：

```ts
// types.ts
export type StyleManagerState = {
  current: StyleDict;
  // 沒有 resetAll
};
```

```ts
// coreSlice.ts
export const createCoreSlice = () => ({
  current: {},
  resetAll: () => { /* ... */ }, // TS 會抱怨
});
```

改後（型別與實作一致）：

```ts
// types.ts
export type StyleManagerState = {
  current: StyleDict;
  resetAll: () => void;
  // 其他 slice 方法...
};
```

```ts
// store.ts
export const useStyleManager = createWithEqualityFn<StyleManagerState>(
  (set, get) =>
    ({
      ...createCoreSlice(set, get),
      ...createImportSlice(set, get),
      ...createExportSlice(set, get),
    }) as StyleManagerState
);
```

**新手檢查清單**

1. 每新增一個 slice method，先同步更新 `StyleManagerState`。
2. slice 合併後若報 `undefined` 型別衝突，先檢查是否過度使用 `Partial<>`。
3. `set/get` 參數不要留 `any`，改成 Zustand `StoreApi` 對應型別。

**目前專案的結構補充**

- store 的責任是管理 `current` / `initial` / `styleSources` / `allStyles` 與 import/export 邏輯。
- selector 預設值不要散落在 feature 元件和 `*.styles.tsx` 各寫一份，改集中到 `src/store/styleManager/defaults/*`。
- 建議按 feature area 拆檔，例如 `defaults/body.ts`、`defaults/plurk-post.ts`。
- feature 元件只做 `setInitialBatch("selector", FEATURE_DEFAULTS)` 註冊；預覽樣式元件若需要 fallback，也引用同一份 defaults。

---

## 6. ESLint：`src/generated/prisma` 被檢查、錯誤量爆炸

**徵兆**

- `next build` 在 lint 階段掃到 Prisma 產生檔，出現大量 `no-unused-expressions`、`no-require-imports` 等。

**原因**

- 自動產生碼不應套用專案 ESLint 規則。

**處理**

- 在 `eslint.config.mjs` 的 flat config 中對 `src/generated/**`、`.next/**` 等設 `ignores`。

**為什麼要這樣做（新手版）**

- Prisma generated code 不是你手寫，也會隨版本更新而變動。
- 如果把 lint 火力放在 generated code：
  - 你會看到大量噪音錯誤（多數不可控）。
  - 真正該修的業務程式錯誤會被淹沒。
- 正確策略是：**lint 只管手寫程式**，generated 交給產生器與上游套件保證。

**改前／改後（精簡）**

```js
// eslint.config.mjs (改後)
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "src/generated/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
```

**新手檢查清單**

1. `npm run lint` 的錯誤路徑若集中在 generated 目錄，先補 ignores。
2. 忽略規則加完後，再跑一次 lint 確認剩下的都是手寫檔案。
3. 不要用「關掉整條 lint 規則」來掩蓋 generated 噪音，先做路徑隔離。

---

## 7. 型別與程式風格（逐步修正 lint）

**常見項目**

- `no-explicit-any`：改為 `Prisma.*WhereInput`、明確 union、或小型 type guard（例如 visibility 字串）。
- `prefer-const`：未再賦值的變數改 `const`。
- `@typescript-eslint/no-unused-vars`：移除未使用參數，或 `_name` + `void _name`（若需保留簽名）。
- `@next/next/no-html-link-for-pages`：站內導向改用 `next/link` 的 `<Link>`。
- `react-color`：`RGBColor` 型別名稱需與套件匯出一致（勿誤用不存在的 `RgbColor`）。

**Zustand slice**

- `set`／`get` 可標成 `StoreApi<StyleManagerState>['setState']` 等，避免 `any`。
- 若 merge 多個 `Partial<StyleManagerState>` 導致「可選屬性」與完整 state 衝突，可在 `createWithEqualityFn` 最外層對初始 state 做合理斷言或補齊預設欄位。

**實作順序（建議新手照這個跑）**

1. 先清「會讓 build fail 的 error」：
   - `no-explicit-any`
   - `no-unused-vars`
   - `prefer-const`
   - Next 專屬 error（例如 `<a>` 改 `<Link>`）
2. 再處理 warning（例如 hook dependency、`<img>`）。
3. 每修一批就跑一次 `npm run lint`，避免一次改太多難回溯。
4. lint 全綠後再跑 `npm run build`，因為 build 還會做額外 type check。

**常見「小改法」模板**

- `any` -> 明確型別（`Prisma.ProjectWhereInput`、union type、`Record<string, T>`）。
- 未使用 catch 參數：`catch { ... }`，或 `catch (error) { console.error(error) }`。
- 站內連結：`<a href="/">` -> `<Link href="/">`。
- 字串 enum 過濾：加 type guard（例如 `isVisibility(value)`）。

**新手重點**

- lint error 不只是「格式問題」，很多其實在預防 runtime bug（像未使用變數、錯誤型別假設）。
- 先把 error 清完，warning 再依產品優先度排期修。

---

## 8. 生產建置：`supabaseUrl is required`

**徵兆**

- `Collecting page data` 階段失敗，堆疊指向 Supabase client 建立處。

**原因**

- API route 在 build 時會載入模組；若於模組頂層 `createClient(...)` 且缺少 `NEXT_PUBLIC_SUPABASE_URL`（及專案慣用的 service key 等），會直接拋錯。

**處理**

- 在本機與部署環境補齊 `.env`（或平台環境變數），與 `lib/supabaseServer` 讀取的變數名稱一致。
- 長期可評估：延遲建立 client（於 handler 內）、或對缺環境變數時明確報錯並避免在 import 時執行。

**新手版補充**

- 為什麼 build 也會炸？
  - Next.js 在 build 會「載入」Route 模組來收集資訊，不是只有 runtime 才載入。
  - 如果模組頂層就執行 `createClient(...)`，缺 env 時會在 build 階段先炸掉。

**建議檢查順序**

1. 先確認 `.env` 有值（不是空字串）。
2. 確認變數名稱與 `supabaseServer` 讀取的 key 完全一致。
3. 確認 build 指令有讀到 `.env`（log 會顯示 `- Environments: .env`）。
4. 部署平台（Vercel / Docker / CI）要另外設同名環境變數。

**可用防呆（選用）**

```ts
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}
```

這種錯誤訊息比套件內部拋的 `supabaseUrl is required` 更好追。

---

## 9. `/editor`：`useSearchParams()` 需 Suspense

**徵兆**

- `next build` 在 prerender `/editor` 時錯誤：  
  `useSearchParams() should be wrapped in a suspense boundary`。

**原因**

- 使用 `useSearchParams` 的 client 元件會讓該段樹在靜態產生時需要「外層 Suspense」邊界，否則無法安全預渲染。

**處理**

- 將使用 `useSearchParams` 的內容拆成子元件（例如 `EditorPageContent`），預設 export 的 page 用  
  `<Suspense fallback={…}><EditorPageContent /></Suspense>` 包起來。

**新手版理解**

- `useSearchParams` 是「跟 URL 狀態綁定」的 client hook。
- 當 `/editor` 又被拿去 prerender（靜態產生）時，Next 需要一個可中斷／可回退邊界，
  這就是 `Suspense` 的作用。
- 沒包 `Suspense` 時，Next 無法保證 prerender 階段的行為一致，因此直接報錯阻止 build。

**改前／改後（精簡）**

改前：

```tsx
"use client";
export default function EditorPage() {
  const searchParams = useSearchParams(); // 直接在 page 內
  // ...
}
```

改後：

```tsx
"use client";

function EditorPageContent() {
  const searchParams = useSearchParams();
  // ...
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <EditorPageContent />
    </Suspense>
  );
}
```

**新手檢查清單**

1. 出錯頁面是否使用了 `useSearchParams` / `usePathname` / 類似 client URL hooks。
2. 該 page 是否有外層 `Suspense`。
3. 修完重跑 `npm run build`，確認 prerender 不再中斷。

---

## 10. `.gitignore` 與文件目錄

**曾出現的差異**

- 新增 `/docs/`：整個 `docs` 目錄被忽略，其下新檔案預設不會被 Git 追蹤。
- 全域 `*.md`：所有未被追蹤的 `.md` 可能被忽略（已追蹤檔案仍會維持追蹤）。

**若要把 issue 紀錄納入版控**

- 在 `.gitignore` 末尾用 `!` 規則**例外**還原 `docs/issue-records/`（與其下 `.md`），或移除會擋住該路徑的規則；以團隊是否要把 `docs/` 全部進 repo 為準。

**新手版重點**

- `.gitignore` 是「忽略規則」，而且**後面的規則可以覆蓋前面**。
- 若你有 `*.md`，它會先把 md 全部忽略；要追蹤特定 md，必須再用 `!` 把它「反忽略」。
- 常見誤解：以為檔案「存在在資料夾裡」就一定能 commit。其實被 ignore 規則命中就不會進 index。

**可參考規則（本專案場景）**

```gitignore
*.md
!docs/issue-records/
!docs/issue-records/**/*.md
```

**新手檢查清單**

1. 新檔案沒出現在 `git status` 時，先看 `.gitignore`。
2. 用 `git check-ignore -v <path>` 找出是哪條規則命中。
3. 若要保留大範圍忽略（例如 `*.md`），就用最小範圍 `!` 例外還原。
4. 規則修改後再看 `git status`，確認檔案已可追蹤。

---

## 快速對照表（錯誤訊息關鍵字）

| 關鍵字片段 | 可能對應章節 |
| --- | --- |
| `@/generated/prisma` | §1 |
| `wasm-engine-edge` / Edge Runtime | §2 |
| `ParamCheck` / `params` / `Promise` | §3 |
| `assets` does not exist on `ProjectInclude` | §4 |
| `resetAll` / `StyleManagerState` | §5 |
| `src/generated/prisma` + ESLint | §6 |
| `supabaseUrl is required` | §8 |
| `useSearchParams` / `suspense` | §9 |
| `.gitignore` / `docs/` | §10 |

---

## 相關指令（複習用）

```bash
npm install          # 觸發 postinstall → prisma generate（若已設定）
npm run db:generate  # 手動產生 Prisma Client
npm run lint
npm run build
```
