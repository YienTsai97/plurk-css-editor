# 回應數徽章匯出覆寫紀錄

> 紀錄 `.response_count` 在 Plurk 實站自訂 CSS 中的覆寫特例，以及本專案目前採用的匯出策略。

---

## 徵兆

在編輯器匯出回應數徽章樣式後，實站測試發現一般 selector 與 `.new` 狀態 selector 不能只靠一般 cascade 順序穩定生效。

曾測試的目標形狀：

```css
._lc_ .timeline-cnt .response_count {
  background-color: rgba(212, 255, 0, 1);
  color: rgba(30, 0, 255, 1);
  font-size: 10px;
  border-radius: 16px;
}

._lc_ .timeline-cnt .new .response_count {
  background-color: rgba(255, 111, 111, 1);
  color: rgba(0, 0, 0, 1);
}
```

理論上 `.new` selector 權重較高，且放在後方時應可覆寫共通背景與文字色；但實站上只輸出這兩段時，已讀與未讀無法同時達成預期。

---

## 實測結論

用 console 確認 selector 本身有命中：

```js
document.querySelectorAll("._lc_ .timeline-cnt .response_count").length
document.querySelectorAll("._lc_ .response_count").length
document.querySelectorAll("._lc_ .new .response_count").length
```

測試結果顯示 `.timeline-cnt .response_count` 與 `.new .response_count` 都能命中實站元素，因此主因不是 DOM 路徑錯誤。

後續測試發現，必須輸出三層：

```css
/* reset */
._lc_ .timeline-cnt .response_count {
  background-color: rgba(212, 255, 0, 1);
  color: rgba(30, 0, 255, 1);
  font-size: 10px;
  border-radius: 16px;
}

/* common final */
._lc_ .timeline-cnt .response_count {
  background-color: rgba(212, 255, 0, 1);
  color: rgba(30, 0, 255, 1);
  font-size: 10px;
  border-radius: 16px;
}

/* state override */
._lc_ .timeline-cnt .new .response_count {
  background-color: rgba(255, 111, 111, 1);
  color: rgba(0, 0, 0, 1);
}
```

純 CSS 理論上兩段相同共通 rule 不應改變結果；這裡保留三段式是為了對抗 Plurk 實站樣式注入、底層規則或自訂 CSS 套用順序造成的實務差異。

---

## 本次改動

改動集中在 `src/store/styleManager/styleManager.ts` 的 `getAllStyles()` 匯出流程：

- 新增 `formatCssBlock()`，集中處理 CSS 屬性排序、kebab-case 轉換與 `[MANUAL]` / `[IMPORTED]` 標籤。
- 新增 `buildCurrentStyleEntries()`，在 response count 特例啟動時，用目前 store 狀態補出共通 reset/common block。
- 偵測以下兩個 selector：
  - `.timeline-cnt .response_count`
  - `.timeline-cnt .new .response_count`
- 任一 selector 有匯出內容時，改由特例輸出：
  1. `[RESPONSE_COUNT_RESET]` reset block
  2. common final block
  3. `.new` state override block
- 已由特例處理的 selector 會跳過一般 `selectorGroups.forEach`，避免重複或被 Map 插入順序打亂。

---

## 結構影響

這次沒有改動 preview、menu 或 defaults 的責任邊界。特例只放在 CSS 匯出出口，避免 workaround 擴散到每個 response count 元件。

目前相關責任分布：

```text
src/components/preview/plurk-timeline/response-count/
  response-count.constants.ts   selector 定義
  response-count-menu.tsx       編輯器 UI
  response-count-styles.tsx     預覽用高權重樣式

src/store/styleManager/defaults/response-count.ts
  response_count 初始值

src/store/styleManager/styleManager.ts
  current / initial / source tracking
  importCSS()
  getAllStyles()
  response_count export override
```

未來若將 style 編輯改成 feature module，建議把本次 helper 搬成 response count feature 的匯出策略，例如：

```text
src/features/style-editor/response-count/
  constants.ts
  defaults.ts
  menu.tsx
  preview-styles.tsx
  export.ts
```

其中 `export.ts` 可接手目前的三段式輸出邏輯；store 只需要呼叫 feature export strategy，而不需要理解 Plurk 實站的 response count 特例。

---

## 後續注意

- 不建議預設對 `background-color` / `color` 加 `!important`，否則共通色會壓過 `.new` 狀態色。
- 若要提高權重，應優先靠輸出順序與 selector 結構；`!important` 僅保留給不應被狀態覆寫的共通屬性測試。
- 若未來找到 Plurk 實站真正干擾的規則，可重新評估是否移除 reset block。
