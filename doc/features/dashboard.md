# 主控台（dashboard）右鍵功能

預覽 `#plurk-dashboard` 有獨立 `ContextMenu`。選單標題「主控台設置」；依點擊區再顯示「特殊區塊」。

路徑根：`src/components/preview/plurk-dashboard/`。

## 常設

### 主控台外殼

| Selector | 屬性 |
|----------|------|
| `._lc_ #plurk-dashboard` | `opacity`、`backgroundColor`、`transition`、`border`、`borderRadius`、`padding` |
| `._lc_ #plurk-dashboard:hover` | `opacity` |

預設平常／hover 皆 `opacity: 1`，背景 `transparent`，`transition: opacity 0.6s`。改任一側透明度時會把另一側與 transition 一併標成 `manual`，匯出時 `ensureDashboardShellTransitionExport` 補齊成對規則。

### 各區塊卡片（segment）

| Selector | 屬性 |
|----------|------|
| `._lc_ #plurk-dashboard .dash-segment:not(.dash-segment-award) .segment-content` | `backgroundColor`、`border`、`padding`、`borderRadius`、`marginTop` |

預設對齊白圓角卡：`#FFF`、`padding: 5px`、`borderRadius: 10px`、`marginTop: 10px`。

## 依點擊區

`dashboard-section-menu-flags.ts` 依 `contextmenu` 目標決定：

### 好友／粉絲頭像列

| Selector | 隱藏時 |
|----------|--------|
| `._lc_ #plurk-dashboard #dash-friends-pics` | `height: 0px`、`overflow: hidden` |
| `._lc_ #plurk-dashboard #dash-fans-pics` | 同上 |

顯示預設：`height: auto`、`overflow: visible`。保留上方加入好友／粉絲按鈕。

### Karma

| Selector | 屬性 |
|----------|------|
| `._lc_ #plurk-dashboard #karma` | `color`（隱藏用 `transparent`） |
| `._lc_ #plurk-dashboard #dash-stats table td` | `fontSize`（隱藏用 `0`；顯示預設 `15px`） |
