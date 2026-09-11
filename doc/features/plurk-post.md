# 噗文相關樣式

右鍵掛在單則 `.plurk` 上；選單組裝見 `plurk-post-context-menu-content.tsx`。

## 貼文外觀

| 項目 | 值 |
|------|-----|
| Selector | `.plurk_cnt` |
| 預設 | `backgroundColor: rgba(255,255,255,1)`、`backgroundImage: none`、`border: none`、`borderRadius: 0px` |
| 右鍵 UI | 背景色、邊框（含圓角） |
| 備註 | Store／預覽仍可承載匯入的 `backgroundImage`、`.name` 的 `color`；選單目前未暴露暱稱色上傳項 |

路徑：`plurk-post-appearance/`。

## 回應數徽章

| 項目 | Selector | 可編輯 |
|------|----------|--------|
| 已讀 | `.timeline-cnt .response_count` | `backgroundColor`、`color`、`borderRadius`（預設 `0%`） |
| 未讀 | `.timeline-cnt .new .response_count` | `backgroundColor`、`color` |

匯出特例：先輸出 reset block（`[RESPONSE_COUNT_RESET]`）再輸出一般／未讀，穩定 Plurk 覆蓋順序。路徑：`plurk-timeline/response-count/`。

## R18 模糊

| 項目 | 值 |
|------|-----|
| Selector | `.timeline-cnt .porn:not(.link_extend) .text_holder` |
| 預設 | `filter: blur(0px)` — **無效果基線**；改過才變 `manual` 並匯出 |
| 選單 | 僅在該則為 R18 類型時顯示 |

## 消音（muted）透明度

| 項目 | 值 |
|------|-----|
| Selector | `.timeline-cnt .muted` |
| 預設 | `opacity: "1"` — **100% 無效果基線** |
| 選單 | 僅 muted 類型顯示 |

## 偷偷說（whisper）

| 項目 | 值 |
|------|-----|
| Selector | `.q_whispers` |
| 預設 | `backgroundColor: #32007e` |
| 選單 | 僅 whisper 類型顯示 |
