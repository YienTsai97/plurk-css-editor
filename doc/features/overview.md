# 預覽功能總覽

給人類與 agent：對齊「右鍵點哪 → 開哪個選單」，以及樣式如何進 `styleManager`。

## 預覽地圖

編輯器中央是模擬 Plurk 個人主頁。主要可編輯區：

| 區域 | DOM／觸發點 | 右鍵選單 |
|------|-------------|----------|
| 河道空白 | `TimelineBackground` 包住 timeline children；空白區穿透到河道 trigger | **河道**（換背景圖）+ **時間軸**（裝飾圖） |
| 噗寶／動態 Logo | 有圖：`DynamicLogoHitZone`；無圖：整顆 `#dynamic_logo` | **噗寶自定義** |
| 噗文 | `.plurk` 上的 `ContextMenu`（`z-index: 8`） | **噗文**（外觀、回應數；依類型再掛 R18／消音／偷偷說） |
| 主控台 | `#plurk-dashboard` | **主控台設置**（外殼、區塊；依點擊區再掛好友粉絲／Karma） |

巢狀 `ContextMenu` 會吃掉子層右鍵，避免外層河道選單蓋過內層。噗寶有圖時 shell 為 `pointer-events: none`，只有 HitZone 接事件——詳見 [dynamic-logo.md](./dynamic-logo.md)。

## styleManager 來源（三態）

每個 selector／屬性在 `allStyles` 帶 `source`：

| source | 意義 | 匯出 |
|--------|------|------|
| `registered` | feature `setInitialBatch` 註冊的預設基線 | **不匯出** |
| `imported` | 使用者貼上 CSS（`replaceImportedCSS`／`importCSS`） | 匯出，標 `[IMPORTED]`（可選 tags） |
| `manual` | 右鍵／上傳等 `setProp` | 匯出，標 `[MANUAL]` |

優先級語意：手動與匯入都會進匯出；`registered` 只當「尚未改動」的基線。R18 預設 `blur(0px)`、消音預設 `opacity: 1` 即為此——無效果基線，改過才變 `manual`。

## Feature 模組對照

| 文件 | 內容 |
|------|------|
| [timeline.md](./timeline.md) | 河道背景 `html`、時間軸裝飾 `._lc_ .timeline-bg` |
| [dynamic-logo.md](./dynamic-logo.md) | 噗寶 Option 3、HitZone、匯出、選單 UX |
| [plurk-post.md](./plurk-post.md) | 貼文外觀、回應數、R18、消音、偷偷說 |
| [dashboard.md](./dashboard.md) | 主控台外殼／區塊／好友粉絲／Karma |
| [../architecture/style-pipeline.md](../architecture/style-pipeline.md) | 匯入展開 shorthand、`setInitialBatch`、匯出過濾 |

## 關鍵路徑（程式）

- Store：`src/store/styleManager/styleManager.ts`、`slices/coreSlice.ts`、`slices/importSlice.ts`、`slices/exportSlice.ts`
- 預設值：`src/store/styleManager/defaults/`
- 預覽 feature：`src/components/preview/plurk-timeline/`、`plurk-post/`、`plurk-dashboard/`
- 匯入解析：`src/utils/parseCssImport.ts`
