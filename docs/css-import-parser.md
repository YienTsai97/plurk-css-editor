# CSS 匯入 Parser：五個檔案的資料流與設計意圖

> 更新日期：2026-09-05
> 本文件說明 CSS 從 textarea 到預覽、StyleManager 與草稿的完整流程。此 parser 是針對常見 Plurk 自訂 CSS 片段的輕量分析器，不是完整 CSS 語法編譯器。

## 1. 全體資料流

```
使用者輸入原始 CSS
  │
  ├─ 即時分析：analyzeImportedCss(source)
  │    ├─ rules：可交給 StyleManager 的規則
  │    ├─ reconstructed：依 parser 結果重建的 CSS
  │    ├─ ignored：被忽略或可能失真的片段
  │    └─ showReconstructedPreview：是否需要顯示差異
  │
  └─ 按下「確認輸入」
       ├─ 空字串 → clearImportedCSS()
       └─ 有規則 → replaceImportedCSS(rules)
                     ├─ 清除上一輪 imported
                     └─ 寫入新 imported + #imported-css-styles
```

這個流程刻意把「輸入中」與「已套用」分開：

- textarea 是使用者正在編輯的來源。
- 下方提示會隨輸入即時分析，但不改變頁面。
- 只有按下「確認輸入」才替換預覽中的 imported 層。
- 最後確認的原文保存在 `plurk-css-editor-imported-source`，方便重新開啟後繼續修改。

## 2. `src/utils/parseCssImport.ts`：解析核心

### 2.1 資料型別

`ParsedCssRule` 將一個 CSS rule 表示成 selector 與 property map：

```ts
type ParsedCssRule = {
  selector: string;
  properties: Record<string, CssValue>;
};
```

使用 map 而不是保留原始宣告文字，是因為 StyleManager 以 camelCase property key 管理狀態，例如 `background-color` 會轉成 `backgroundColor`。

`IgnoredCssItem` 記錄 parser 沒有照原文套用的原因：

- `block-comment`：合法的 `/* ... */` 註解已移除。
- `line-comment`：CSS 不支援的整行 `// ...` 已忽略。
- `dropped-property`：無法拆成 `名稱: 值` 的宣告。
- `unclosed-block`：出現 `{` 但沒有對應的 `}`。
- `leftover`：完整規則以外的殘留文字。
- `merged-into-selector`：文字黏進 selector，可能造成選擇器無法匹配。

`CssImportAnalysis` 一次回傳 UI 與匯入所需結果，避免畫面提示和實際套用各自解析、得到不同答案。

### 2.2 註解與 `//` 行

`extractBlockComments()` 移除合法 CSS 註解並計數。註解不影響 selector 或 property，因此 UI 通常只顯示「已移除 N 則註解」，不重複整段內容。

`extractFullLineSlashComments()` 處理常見誤用：

```css
//123
.plurk_cnt { ... }
```

CSS 並不支援 `//` 註解。若不先處理，舊 parser 會把 `//123` 黏成 selector 的一部分，導致 `.plurk_cnt` 無法命中。現在完整一行的 `//...` 會被列為 ignored，並在實際解析前移除；inline `//` 不會被武斷改寫，而是警告可能已併入 selector。

### 2.3 Rule 與 property 拆解

`analyzeImportedCss()` 以 `{`、`}` 找出一般規則，再將 block 內宣告拆解：

1. 讀取 selector。
2. 以分號或換行分隔宣告。
3. 以第一個冒號拆成 property 與 value。
4. 將 kebab-case property 轉成 camelCase。
5. 無法解析的宣告加入 `ignored`，不寫入 `rules`。

這套做法適合一般的：

```css
.plurk_cnt {
  background-color: white;
  border: 1px solid #ddd;
}
```

但不是完整 CSS AST，所以不保證正確支援 `@media`、巢狀規則、複雜函式內容或預處理器語法。

### 2.4 重建與差異判斷

`reconstructCss(rules)` 將 StyleManager 真正收到的結構重新輸出成 CSS。這段文字代表「實際會匯入的內容」，不是單純複製 textarea。

`normalizeCssForCompare()` 只消除不影響語意的格式差異：

- 移除 block comment。
- 合併多餘空白。
- 正規化 `{`、`}`、`;`、`:` 周圍空白。

若原文與 reconstructed 經正規化後相同，就不顯示重複預覽；只有 parser 忽略、改寫或吞掉內容時，`showReconstructedPreview` 才為 true。

## 3. `src/components/preview/common/css-import.tsx`：畫面整合

### 3.1 textarea 與來源保存

`cssInput` 保存當前 textarea。元件掛載時從 `plurk-css-editor-imported-source` 還原最後一次確認過的原文。

輸入文字本身不會立即寫進預覽；`persistImportedSource()` 只在確認成功或清除 imported 時更新 localStorage，確保「保存的原文」與目前 imported 層代表同一次確認。

### 3.2 即時分析提示

元件每次 render 都以 `analyzeImportedCss(cssInput)` 取得分析結果：

- 有 ignored 項目時顯示「以下內容不會依原文套用」。
- 只有註解差異時顯示簡短的「已忽略註解」，不複製整份 CSS。
- 正規化後仍有實質差異時，才顯示「實際會匯入的內容」及 reconstructed CSS。

這個區塊不是視覺效果預覽；它是 parser 結果預覽，用來說明輸入內容和實際匯入可能不同。

### 3.3 確認與清空

`handleConfirm()`：

- textarea 為空：呼叫 `clearImportedCSS()`，只移除 imported，不影響右鍵 manual 樣式。
- textarea 有內容：把同一份分析結果中的 `rules` 傳給 `replaceImportedCSS()`。
- 確認後不清空 textarea，使用者可回來修改再覆蓋。

「取消並清空輸入」只清 textarea，不立即改變頁面；這讓使用者可以先編輯，再決定是否按確認覆蓋目前 imported。

## 4. `src/store/styleManager/slices/importSlice.ts`：模組化 Store 實作

這個 slice 負責 imported 樣式在 DOM 與 Zustand state 的生命週期。

### 4.1 `importCSS`

接收已解析的 `CSSRule[]`，並同步寫入：

1. `<style id="imported-css-styles">`。
2. `current[selector]` 的目前值。
3. `allStyles` 中 source 為 `imported` 的 entry。
4. `styleSources` 的來源標記。
5. 預覽使用的 CSS variables。

它不負責理解原始 CSS 字串；解析責任留在 `parseCssImport.ts`。

### 4.2 `clearImportedCSS`

只清 source 為 `imported` 的資料：

- 移除 `#imported-css-styles`。
- 移除 imported CSS variables。
- 從 `allStyles`、`styleSources` 與 `current` 清掉 imported。
- 有 registered 初始值時回復 initial。

manual 右鍵變更不應被一般「清空匯入」誤刪。

### 4.3 `replaceImportedCSS`

```ts
clearImportedCSS();
importCSS(nextRules);
```

先清後寫是必要的。若直接 merge，新 textarea 已刪除的 selector／property 仍會殘留在 store，造成 `#imported-css-styles` 看起來更新了，但其他高權重預覽樣式仍使用舊值。

### 4.4 `resetAllToInitial`

「回復為初始模板」是較強的操作：除了 imported，也清除 manual，將 `current`、`allStyles`、`styleSources` 回到 registered 初始狀態。它和一般的 `clearImportedCSS` 不能混用。

## 5. `src/store/styleManager/styleManager.ts`：目前 `/editor` 使用的 Store

專案目前仍保有單檔版 StyleManager；`/editor` 的 import path 會走這個檔案。它和 `slices/importSlice.ts` 維持同樣的公開 API：

- `importCSS`
- `replaceImportedCSS`
- `clearImportedCSS`
- `resetImportedToInitial`
- `resetAllToInitial`
- `getAllStyles`

`useCSSImporter()` 將這些方法包成 React hook 介面，供匯入、匯出、Dock 與頁面草稿流程使用。

此處與 slice 版需要同步維護；未來若完成 store 模組化，應移除重複實作，避免同名方法行為分歧。

## 6. `src/app/editor/page.tsx`：載入與草稿入口

`/editor` 還有兩個不是從匯入 Dialog 進入的 CSS 來源：

1. URL query `?import=...`
2. `plurk-css-editor-draft` 自動草稿

目前這兩條路徑仍使用頁面內的舊 `parseCSS()`，再呼叫 `importCSS()`。這表示它們沒有匯入 Dialog 的 ignored／diff 提示，也不是 replace 語意。

保留舊流程的原因是避免這次 UI parser 改動同時影響分享連結與草稿復原。後續建議將兩者統一成：

```ts
const { rules } = analyzeImportedCss(cssText);
replaceImportedCSS(rules);
```

統一前必須先驗證：草稿中的來源標記註解、分享連結內容與舊 parser 是否能得到相同結果。

## 7. 已知限制與維護原則

- Parser 是 best-effort，不支援完整 CSS grammar。
- `@media`、`@supports`、巢狀規則與預處理器語法可能被忽略或重建失真。
- CSS value 若含複雜分號／冒號，輕量拆解可能判斷錯誤。
- UI 必須誠實呈現 reconstructed 與 ignored，不應宣稱所有合法 CSS 都能解析。
- 實際套用與提示必須共用同一次 `analyzeImportedCss()` 結果。
- imported 替換不得清除 manual；只有「回復為初始模板」可以清除兩者。

## 8. 範例

輸入：

```css
/* 示意用：外框線預覽 */
//123
.plurk_cnt {
  outline: 3px dashed #FF574D;
}
```
提示：

- 已移除 1 則註解。
- `//123` 不是有效 CSS 註解，已忽略。

實際匯入：

```css
.plurk_cnt {
  outline: 3px dashed #FF574D;
}
```

