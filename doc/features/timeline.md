# 河道背景與時間軸裝飾

## 河道背景

| 項目 | 值 |
|------|-----|
| Store selector | `html`（`TIMELINE_BACKGROUND_SELECTOR`） |
| 預設 | `BODY_STYLE_DEFAULTS`：`backgroundImage: none`、`size: cover`、`repeat: no-repeat`、`position: center`、`attachment: scroll` |
| 右鍵 | 選單標題「河道」→「更換背景圖」（`ImageUploader`） |
| 預覽 | `#background_layout` 等注入（見 `timeline-background-styles.tsx`） |
| 匯出 | `formatTimelineBackgroundExportBlock`：固定屬性順序（shell／background-*），避免字母排序打亂 |

路徑：`src/components/preview/plurk-timeline/timeline-background/`。

## 時間軸裝飾

| 項目 | 值 |
|------|-----|
| Store selector | `._lc_ .timeline-bg` |
| 預設 | `backgroundImage: none`、`size: 50px`、`repeat: repeat-x`、`position: bottom`（對齊 Plurk stub，非河道 cover） |
| 右鍵 | 同河道選單內「時間軸」→「更換裝飾圖」；有圖後可開「裝飾圖設定」（size／repeat／position） |
| 預覽 DOM | `#layout_content._lc_ > .timeline-bg` |

路徑：`src/components/preview/plurk-timeline/timeline-decoration/`。

## Wrapper 注意

`TimelineBackground` 同時掛兩套 Styles、兩個 ImageUploader、共用外層 `ContextMenu`。Dialog state 放在 wrapper，不放在 `ContextMenuContent`，避免選單關閉時 dialog 被 unmount。
