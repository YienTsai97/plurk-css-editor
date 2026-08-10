# EDITOR_ONLY_MODE、頂欄圖示與 Dashboard 版面紀錄

> 紀錄 `/editor` 在開啟 `EDITOR_ONLY_MODE` 後頂欄 icon 破圖、右側欄被擠下，以及 `globals.css` side-effect import 型別錯誤的原因與處理。

---

## 1. 頂欄 icon 消失（破圖）

### 徵兆

- `/editor` 頂欄左側／中間出現破圖，`alt` 可見 `star`、`plurklogo`。
- DevTools／`next/image` 可能出現來源不是合法圖片的錯誤。

### 原因

[`src/components/preview/plurk-top-bar.tsx`](../../src/components/preview/plurk-top-bar.tsx) 透過 `next/image` 載入 public 靜態檔：

- `/testicon/star.svg`
- `/plurk-icon.svg`

檔案本身存在於 `public/`，但 `.env` 若設 `EDITOR_ONLY_MODE=true`，[`src/middleware.ts`](../../src/middleware.ts) 會把未 allowlist 的路徑 307 導向 `/under-construction`（HTML）。

matcher 排除了 `api`、`_next/static`、`_next/image`、`favicon.ico`，**沒有**排除一般 `public` 靜態路徑，因此 image optimizer 向原始 URL 取檔時拿到 HTML → 破圖。

```text
PlurkTopBar → /_next/image?url=/testicon/star.svg
           → 實際去抓 /testicon/star.svg
           → middleware 未放行 → /under-construction (HTML)
           → broken image
```

### 處理

在 `isAllowedInEditorOnlyMode` 放行編輯器預覽需要的靜態路徑，例如：

- `/testicon`
- `/plurk-icon.svg`

並保留 `/editor`、`/under-construction`、`/api/auth` 等必要路徑。

`/` 在 editor-only 模式下改導向 `/editor`；其餘未放行路徑導向 `/under-construction`。

### 注意

- 之後若頂欄改用其他 `public/` 圖檔（例如 `/*.png`），必須同步加入 allowlist，或改成以副檔名／靜態資源規則放行，否則會重現破圖。
- 右側 `pif-bone` / `pif-notify` 等空 `<i>`（未載入 icon font）與本次 middleware regression 無關。

---

## 2. Dashboard 右側欄被擠到下一行

### 徵兆

- `#plurk-dashboard` 左側 profile 正常，右側統計／朋友／粉絲整塊掉到下方。
- 左側旁出現大塊空白（右欄應並排的位置）。

### 原因

[`src/components/preview/plurk-dashboard/plurk-dashboard.tsx`](../../src/components/preview/plurk-dashboard/plurk-dashboard.tsx) 使用 float：

- 左欄：`width: 33%` + `padding-right: 10px`
- 右欄：`width: 67%`

Tailwind preflight（經 [`src/app/globals.css`](../../src/app/globals.css)）會設：

```css
*, ::before, ::after { box-sizing: border-box; }
```

若暫時註解掉 `layout.tsx` 的 `import "./globals.css"`，改回 **content-box** 後：

| box-sizing | 左欄實際寬度 | 與右欄合計 |
| --- | --- | --- |
| `border-box`（globals 開） | 33%（padding 含在內） | ≤ 100%，並排 |
| `content-box`（globals 關） | 33% + 10px | **100% + 10px**，右欄 wrap |

Dashboard 本身 float CSS 並未改；是關掉 globals 後才爆。

### 處理

- 恢復 `import "./globals.css"`（目前預設路徑），或
- 若刻意不載入全域 Tailwind preflight，應在 `#plurk-dashboard .dash-group-left` / `.dash-group-right` 本地補 `box-sizing: border-box`。

---

## 3. `Cannot find module or type declarations for side-effect import of './globals.css'`

### 徵兆

- [`src/app/layout.tsx`](../../src/app/layout.tsx) 的 `import "./globals.css"` 出現 TS2882（或類似）錯誤。
- 執行期 CSS 可能仍正常，僅型別／IDE 報錯。

### 原因

Next 內建型別主要宣告 `*.module.css`，**沒有**一般 `*.css` 的 ambient module。  
較新的 TypeScript（含對 side-effect import 更嚴格的檢查）會要求側效 import 也要找得到型別宣告。

### 處理

新增 [`src/types/css-modules.d.ts`](../../src/types/css-modules.d.ts)：

```ts
declare module "*.css";
```

並在 [`tsconfig.json`](../../tsconfig.json) 的 `include` 加入 `**/*.d.ts`，確保宣告檔進入專案。

---

## 相關檔案

| 檔案 | 角色 |
| --- | --- |
| `src/middleware.ts` | `EDITOR_ONLY_MODE` allowlist |
| `src/app/under-construction/page.tsx` | 未開放路徑落地頁 |
| `src/components/preview/plurk-top-bar.tsx` | 頂欄圖示來源 |
| `src/components/preview/plurk-dashboard/plurk-dashboard.tsx` | float 雙欄版面 |
| `src/app/layout.tsx` / `src/app/globals.css` | 全域 CSS／preflight |
| `src/types/css-modules.d.ts` | `*.css` 模組宣告 |
| `tsconfig.json` | 納入 `*.d.ts` |
