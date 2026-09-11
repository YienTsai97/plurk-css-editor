# 噗寶（dynamic-logo）— Option 3 規格

技術規格（zh-TW）。對齊現況程式；勿發明 API。事故脈絡見 [../issue-records/2026-09-10-dynamic-logo-hit-menu.md](../issue-records/2026-09-10-dynamic-logo-hit-menu.md)。

---

## 1. 目標行為

| 右鍵目標 | 應開選單 |
|----------|----------|
| 空白河道 | 河道／時間軸 |
| 噗文（`.plurk`，預覽 `z-index: 8`） | 噗文 |
| 可見自訂噗寶圖 | 噗寶自定義；有圖時大小／位置可用 |

有自訂圖時：全尺寸 shell 不可攔截空白區；熱區只對齊可見圖。

---

## 2. Option 3 架構（預覽 vs 匯出）

### 預覽（有 `backgroundImage` 且非 `none`）

| 層 | 行為 |
|----|------|
| Shell `#dynamic_logo` | `width/height: 100%`、`z-index: 1`、`transition: none`、**`pointer-events: none`**（僅預覽注入，不進 StyleKey） |
| HitZone | 對齊可見 logo 的 absolute box，`pointer-events: auto`，掛 `ContextMenuTrigger` |
| `#dynamic_logo > img` | 預覽強制 `opacity: 0` + `pointer-events: none`（官方 creature 隱藏且不搶事件） |
| 空白穿透 | 事件落到河道 trigger |
| 噗文 | 較高 z-index → 右鍵仍為噗文選單 |

無自訂圖：整顆 `#dynamic_logo`（含 creature）當 `ContextMenuTrigger`（no-image path）；大小／位置控制項 disabled。

### 匯出（`formatDynamicLogoExportBlock`）

有自訂圖時輸出嚴格區塊（非一般 `formatCssBlock`）：

- `#dynamic_logo>img { opacity: 0; }`（匯出 selector **無空白**：`#dynamic_logo>img`）
- `#dynamic_logo`：`background: url(...) no-repeat;` + `background-size` + `background-position` + **`z-index: 500`** + `width/height: 100%` + transition none
- **不含** `pointer-events`（Plurk 不需要預覽用的穿透）

常數：`DYNAMIC_LOGO_EXPORT_Z_INDEX = 500`（預覽用 1）。

---

## 3. Store 與預設

Selectors：

- `#dynamic_logo` — `backgroundImage` / `backgroundSize` / `backgroundRepeat` / `backgroundPosition`
- `#dynamic_logo > img` — `opacity`（store／預覽用空白；匯出改成無空白）

預設（`defaults/dynamic-logo.ts`）：

```
backgroundImage: none
backgroundSize: auto
backgroundRepeat: no-repeat
backgroundPosition: calc(100%) calc(0%)   // 右上
opacity (img): 1                            // 無自訂圖時不藏官方噗寶
```

`hasCustomLogoImage(backgroundImage)`：字串非空且非 `none`。

---

## 4. 上傳 → 必須寫 `NNpx`

HitZone 只解析 `background-size: NNpx`（單軸 px；高度依原圖比例）。

上傳流程（`onUploadedUrl`）：

1. 寫 `backgroundImage`、`no-repeat`、預設雙 calc 位置、`img opacity: 0`
2. 預設倍率 `DYNAMIC_LOGO_DEFAULT_SCALE_PERCENT = 100`
3. **有 naturalWidth cache → 立刻** `scaleToBackgroundSizePx` → `NNpx`
4. 否則 load 後再寫；**勿長留 `auto`**（parse 不到 → 熱區 0×0 或 `pointer-events: none`）

倍率範圍：10–500%。步進微調：`DYNAMIC_LOGO_POSITION_STEP_PX = 10`。

---

## 5. 雙 calc 位置模型

內部 `LogoPosition`：`xBase`/`yBase` ∈ `{0,100}` + `xOffsetPx`/`yOffsetPx`。

寫入格式：

- 無位移：`calc(100%) calc(0%)`
- 從右：`calc(100% - Npx)`；從左：`calc(0% + Npx)`（Y 同理）

四角預設 offsets 歸零。方向鍵／按鈕從**目前角落**累加（`nudgeLogoPosition`：右移在 `xBase===100` 時減少 offset）。相容舊字串 `right Npx top Mpx`。

HitZone 幾何：`xBase 100` → `right: offset`；`xBase 0` → `left: offset`（見 `computeLogoHitZoneBox`）。

---

## 6. 選單 UX

檔案：`dynamic-logo-menu.tsx`、`dynamic-logo-hold-nudge.ts`。

| 項目 | 行為 |
|------|------|
| `showValue={false}` | 大小滑桿不顯示內建數值列；旁邊用獨立 number input |
| Draft inputs | `useCommittedNumberDraft`：focus 時本地字串；blur／Enter 才 commit／clamp，避免每鍵被打斷 |
| Hold-to-nudge | 方向鍵：立刻一步 → 延遲 **350ms** → 每 **60ms** 連發；`pointer capture`，leave 不中斷，up／cancel／blur 停止 |
| 無圖 | 大小／位置區塊 `disabled`／半透明 |

主層項目：上傳圖片、調整大小、調整位置（四角 + 十字微調 + X/Y）、重置。

---

## 7. 與河道／噗文選單的巢狀關係

- 河道：`TimelineBackground` 外層 `ContextMenu` 包住 timeline children。
- 噗寶：內層再包一層 `ContextMenu`；有圖時 trigger 只在 HitZone → 空白不開噗寶選單。
- 噗文：獨立 `ContextMenu`，stacking 高於預覽 logo shell（`z-index: 1`），故點噗文不開噗寶。

若河道＋噗文都開成噗寶、且控制項灰階：優先查 import shorthand／`setInitialBatch` 是否 wipe `current`（見 style-pipeline 與 issue-record），**不要**只怪熱區 0×0。

---

## 8. 關鍵檔案路徑

| 路徑 | 角色 |
|------|------|
| `src/components/preview/plurk-timeline/dynamic-logo/dynamic-logo.tsx` | Feature wrapper、上傳、有圖／無圖分支 |
| `dynamic-logo-styles.tsx` | `setInitialBatch`；預覽 shell CSS（含 `pointer-events: none`） |
| `dynamic-logo-hit-zone.tsx` / `dynamic-logo-hit-zone.utils.ts` | 熱區 DOM 與 box 計算 |
| `dynamic-logo-menu.tsx` | 選單 UI、draft input、`showValue={false}` |
| `dynamic-logo-hold-nudge.ts` | 350ms／60ms 連發 |
| `dynamic-logo.utils.ts` | 位置／倍率、`formatDynamicLogoExportBlock`、`hasCustomLogoImage` |
| `dynamic-logo.constants.ts` | selector、匯出 z-index、步進與範圍 |
| `src/store/styleManager/defaults/dynamic-logo.ts` | store 預設 |
| `src/utils/parseCssImport.ts` | `expandBackgroundShorthand`、img selector 正規化 |
| `src/store/styleManager/styleManager.ts` | `normalizeImportedLogoRule`、`setInitialBatch`、匯出特例 |
