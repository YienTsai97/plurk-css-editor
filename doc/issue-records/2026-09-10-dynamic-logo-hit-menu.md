# 噗寶（dynamic-logo）hit-testing／右鍵選單／控制項灰階事件

| 欄位 | 內容 |
|------|------|
| **日期** | 2026-09-10 |
| **狀態** | Resolved |
| **範圍** | Preview 噗寶 `#dynamic_logo`：右鍵選單路由、圖層、`hasImage` 控制項 |
| **相關路徑** | `src/components/preview/plurk-timeline/dynamic-logo/` |
| **修復 agent** | `b0fbd114-25de-4c23-98f2-54c3942d2a9b` |

---

## 1. 症狀（使用者回報）

1. 右鍵**空白河道** → 開出**噗寶**選單（應為河道選單）
2. 右鍵**噗文** → 開出**噗寶**選單（應為噗文選單）
3. 右鍵**可見 logo** → 噗寶選單有開，但**大小／位置控制項灰階**（不可用）
4. Logo 層看起來壓在河道／噗文之上（噗文應維持較上層）

四點常同時出現；診斷時應當成**同一組症狀簇**，不要只挑 hit-zone 面積解釋。

---

## 2. 預期行為（Option 3 — 回歸前已驗證可用）

架構目標（預覽）：

| 層 | 行為 |
|----|------|
| Shell `#dynamic_logo` | `width/height: 100%`、`z-index: 1`、`pointer-events: none`（僅預覽；空白穿透） |
| Hit zone | `pointer-events: auto`，對齊可見圖，掛 `ContextMenuTrigger` |
| 空白河道 | 河道 context menu |
| `.plurk` | `z-index: 5` 等，保持在 logo 之上 → 噗文選單 |
| 可見 logo 熱區 | 噗寶自定義選單；`hasImage === true` 時大小／位置可用 |

匯出：shell `z-index: 500`，**不含** `pointer-events`（見 `DYNAMIC_LOGO_EXPORT_Z_INDEX`、`formatDynamicLogoExportBlock`）。

有圖時 React 走 HitZone 路徑；無圖時整顆 `#dynamic_logo` 當 `ContextMenuTrigger`（no-image path）。

---

## 3. 時間線／嘗試過的路徑

1. **Option 1**：拿掉 shell 的 `pointer-events: none` → logo 右鍵可用，但整顆 100% shell 擋住河道。
2. **Option 3**：shell `none` + 獨立 HitZone → **通過**（河道／噗文／logo 選單正確；噗文在 logo 上）。
3. **Redundancy cleanup**（NaturalSize 更名、draft inputs、hold-nudge、showValue 等）後 → 使用者回報回歸。
4. 要求 **full revert** 到 Option 3 後、cleanup 前；資料夾當時 **untracked**，無法 `git checkout`，只能依 transcript 重建。表面 cleanup 痕跡清掉後，**行為仍錯**。
5. Agent `b0fbd114-…` 找出真正根因並修好（見下）。

---

## 4. 根因（與症狀對應）

### A — Import 只存 `background` shorthand，未拆成 `backgroundImage`

- **匯出**寫：`background: url(...) no-repeat`
- **匯入**若只進 store 的 `background`，`hasCustomLogoImage()` 只看 `backgroundImage` → 一直 `false`
- 結果：
  - `controlsDisabled = !hasImage` → 症狀 3（控制項灰階）
  - 走 **no-image path**：整顆 `#dynamic_logo` 當 trigger → 大面積搶右鍵 → 症狀 1–2
  - 預覽若仍依匯出／injected `<style>` 畫出大圖 + 高 z-index，圖層看起來蓋住河道／噗文 → 症狀 4

### B — `setInitialBatch` 覆蓋已 import 的 `current`

- 父層 draft 先 `importCSS`，子元件 mount 再 `setInitialBatch`
- **舊實作**把 `current[selector]` 整包換成 defaults → 清掉剛匯入的 `backgroundImage` 等
- Store 以為無圖（`hasImage` false），但 DOM 上 imported `<style>` 仍可依匯出規則畫 logo（含 **`z-index: 500`**、全尺寸殼）→ 視覺有圖、點擊全進噗寶選單、控制項仍灰

### Secondary — 上傳曾先寫 `background-size: auto`

- Hit zone 只解析 `NNpx`；`auto` → 面積 0×0（或未就緒時 `pointer-events: none`）
- 單獨會讓「有圖卻點不到 logo」，**不會**讓河道＋噗文都開噗寶選單；與症狀 1–2 主因不同
- 修復：有 cache／load 後**盡快寫 `NNpx`**，勿長留 `auto`

---

## 5. 修復摘要與關鍵檔案

| 項目 | 檔案 | 作法 |
|------|------|------|
| Shorthand 展開 | `src/utils/parseCssImport.ts` | `expandBackgroundShorthand`：`background` → `backgroundImage`／`backgroundRepeat` |
| Import 正規化 | `src/store/styleManager/styleManager.ts` | `normalizeImportedLogoRule`：`#dynamic_logo>img` 對齊 store key + 同樣拆 background |
| 保留 current | `styleManager.ts` + `slices/coreSlice.ts` | `setInitialBatch`：`mergedCurrent = { ...defaults, ...existingCurrent }`；不蓋 `imported`／`manual` |
| 上傳尺寸 | `dynamic-logo.tsx` → `onUploadedUrl` | cache 有寬則立刻 `scaleToBackgroundSizePx`；否則 load 後寫 `NNpx` |

驗證時以這幾處現況為準；註解已標明「勿整包換成 defaults」「勿先寫 auto」。

---

## 6. 手動驗證清單

匯入含噗寶的自訂 CSS（或 draft）後：

- [ ] Store：`#dynamic_logo` 有 `backgroundImage: url(...)`（不是只剩 `background`）
- [ ] 右鍵空白河道 → **河道**選單
- [ ] 右鍵噗文中央 → **噗文**選單
- [ ] 右鍵可見 logo → **噗寶**選單，且大小／位置**非**灰階
- [ ] 噗文仍可點到（不被 logo shell 擋住）
- [ ] DevTools：`elementFromPoint` 分別點空河／噗文中心／可見 logo；查 `#dynamic_logo` 的 computed `pointer-events`／`z-index`；hit zone 有非零寬高；store `backgroundImage`

上傳新圖：

- [ ] 上傳後不久 `background-size` 為 `NNpx`（非長期 `auto`）
- [ ] Hit zone 可對齊可見圖並開選單

---

## 7. 給未來 agent 的指引

### 應維持

- **保留 Option 3**（shell `pointer-events: none` + HitZone）。不要退回 Option 1。

### 症狀簇判讀

若 **河道＋噗文都開噗寶** 且 **控制項灰階**，優先查：

1. `hasImage`／`hasCustomLogoImage(backgroundImage)`
2. Import 是否留下 shorthand `background` 未展開
3. `setInitialBatch` 是否 wipe 掉 import 的 `current`
4. Injected／匯出 CSS 是否以 `z-index: 500` 在畫，而 React store 仍無 longhand

**不要**只怪 hit-zone `0×0`：那通常開的是**河道**選單，與症狀 1–2 矛盾。

### 反模式（本次踩過、勿重做）

| 錯誤假設 | 為何浪費時間 |
|----------|----------------|
| 只怪 hit-zone `auto` → 0×0 | 與「河道／噗文都開噗寶」矛盾 |
| 怪 build agent 的 `_imgProps`／`void _imgProps` ESLint 修法 | 無關 |
| 接受「大 logo 下點不到噗文」當合理 tradeoff | 與 Option 3 已通過的測試矛盾 |
| 以為 redundancy cleanup 刪了 hit-zone 檔 | 檔案仍在 |
| 把「hard refresh／清 `.next`」等同「code cleanup revert」 | 快取與邏輯回歸是兩件事 |
| 加外部 `verify.mjs` 或大範圍 rename cleanup 當「修復」 | 不對症 |

### Repo 備註

- `dynamic-logo/` 曾長期 **untracked**；驗證通過後宜 **commit 工作狀態**，避免再次只能靠 transcript 重建。
- 本文件僅供參考；勿在未確認現況前依舊假設改架構。

---

## 8. 後續規格與基線（銜接用）

完整 Option 3／HitZone／選單 UX 與管線語意已收斂到 feature／architecture 文件，本事故紀錄不重寫：

- [doc/features/dynamic-logo.md](../features/dynamic-logo.md) — shell `pointer-events: none` + HitZone、匯出 `z-index: 500`、上傳→`NNpx`、雙 calc、**draft input**、**hold-to-nudge（350ms／60ms）**、`showValue: false`
- [doc/architecture/style-pipeline.md](../architecture/style-pipeline.md) — shorthand 展開、`setInitialBatch` 保留 current、匯出過濾 registered
- [doc/features/plurk-post.md](../features/plurk-post.md) — R18 基線 `blur(0px)`、muted 基線 `opacity: 1`（無效果 registered，改過才匯出）

總覽：[doc/features/overview.md](../features/overview.md)。
