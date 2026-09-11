# 樣式管線（style pipeline）

匯入 → store → 預覽 → 匯出。硬教訓集中在 **background shorthand** 與 **`setInitialBatch` 不可 wipe current**。

---

## 1. 三態與資料流

```
feature mount ──setInitialBatch──► initial + current（補缺）+ source=registered
使用者右鍵／上傳 ──setProp──► current + source=manual
貼上 CSS ──analyzeImportedCss → replaceImportedCSS──► current + source=imported
匯出 getAllStyles ──略過 registered──► 只輸出 imported / manual（含 feature 特例格式）
```

實作主檔：`src/store/styleManager/styleManager.ts`（與 `slices/coreSlice.ts` 對齊語意）。

---

## 2. 匯入：`background` shorthand → longhand

### 問題

噗寶匯出寫：

```css
#dynamic_logo{
  background: url('...') no-repeat;
  ...
}
```

若 parser 只存 camelCase 的 `background`，`hasCustomLogoImage(backgroundImage)` 永遠 false → 走 no-image path（整顆殼當 trigger）+ 控制項灰階，但 injected／舊 CSS 仍可能畫出大圖與高 z-index。

### 正確作法

1. **`expandBackgroundShorthand`**（`src/utils/parseCssImport.ts`）  
   - 刪除 `background`  
   - 抽出 `url(...)` → `backgroundImage`（若尚無）  
   - 抽出 `repeat-x|repeat-y|no-repeat|repeat|space|round` → `backgroundRepeat`（若尚無）  
   - `none`／空 → `backgroundImage: none`  
   - 每條 rule 解析完後套用（不限噗寶）

2. **Selector 正規化**  
   - `#dynamic_logo>img`／空白變體 → store key `#dynamic_logo > img`

3. **`normalizeImportedLogoRule`**（`styleManager.ts` 的 `importCSS` 路徑）  
   - 再做一次 img selector 對齊 + background 拆解，雙保險

呼叫鏈：編輯器 `analyzeImportedCss` → `replaceImportedCSS`（先 `clearImportedCSS` 再 `importCSS`）。

---

## 3. `setInitialBatch`：必須保留 current／manual／imported

### 問題

父層 draft／import 先寫入 `current`，子 feature mount 再 `setInitialBatch`。舊實作把 `current[selector]` **整包換成 defaults** → 清掉剛匯入的 `backgroundImage` 等。Store 以為無圖，DOM 上 imported `<style>` 仍可依匯出規則畫 logo（含 `z-index: 500`）。

### 正確語意（現況）

```ts
mergedInitial = { ...existingInitial, ...init }
mergedCurrent = { ...mergedInitial, ...existingCurrent }  // existing 蓋過 defaults
```

對 `styleSources`／`allStyles`：若既有 entry 的 `source` 為 `imported` 或 `manual`，**不覆寫**成 `registered`。

註解關鍵句：feature remount 時不可把 draft／上傳寫入的值蓋成 registered 預設。

---

## 4. 匯出：過濾 registered 預設

`getAllStyles`：

1. 遍歷 `allStyles`，**`source === "registered"` 直接跳過**
2. 其餘依 timestamp 分組到 selector
3. Feature 特例：
   - Dashboard shell：成對 opacity + transition
   - Response count：reset block + 一般 + 未讀
   - Dynamic logo：`formatDynamicLogoExportBlock`（shorthand + `z-index: 500`，無 pointer-events）
   - Timeline background：固定屬性順序區塊

因此 R18 預設 `blur(0px)`、muted 預設 `opacity: 1` 不會出現在匯出，直到使用者改過（`manual`）或由匯入帶入（`imported`）。

---

## 5. 回歸檢查清單（agent）

匯入含噗寶的 CSS 後：

- [ ] Store `#dynamic_logo.backgroundImage` 為 `url(...)`，不是只剩 `background`
- [ ] Feature remount／`setInitialBatch` 後 `current` 仍保留該 url
- [ ] 匯出略過未改動的 registered；有圖時噗寶區塊含 `z-index: 500` 且無 `pointer-events`
- [ ] 右鍵路由：空河→河道、噗文→噗文、可見 logo→噗寶且控制項可用

相關：`doc/features/dynamic-logo.md`、`doc/issue-records/2026-09-10-dynamic-logo-hit-menu.md`。
