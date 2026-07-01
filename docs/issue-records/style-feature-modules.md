# Style Feature Module 拆分紀錄

> 紀錄這次將「貼文外觀」與「河道背景」改成 feature module 的原因、檔案結構與新手理解方式。  
> 同頁補充舊方法的邏輯，以及 `response-count` 匯出特例的簡化流程。

---

## 這次改了什麼

這次把原本散在大元件裡的 style 編輯邏輯，整理成三個 feature module：

- `plurk-post-appearance`
  - 管貼文本體 `.plurk_cnt`
  - 目前包含背景色與邊框
- `timeline-background`
  - UI 名稱是河道背景
  - 實際 selector 仍是 `body`，保留舊草稿與匯出相容性
- `response-count`
  - 管回應數徽章 `.timeline-cnt .response_count`
  - 管未讀徽章 `.timeline-cnt .new .response_count`

feature module 的意思是：**一個可編輯 CSS target 自己管理自己的 selector、menu、預設值註冊、即時預覽 CSS**。

---

## 新手版：先把 feature module 想成一個小抽屜

以前的寫法比較像把所有工具都放在桌面上：

```text
page.tsx
  ├─ body 背景 selector
  ├─ ImageUploader 狀態
  ├─ 河道 menu
  └─ EditorPageStyle props

plurk-post.tsx
  ├─ .plurk_cnt selector
  ├─ useStyleProp
  ├─ changed flags
  ├─ PlurkPostStyles props
  └─ 貼文 menu props
```

東西都能用，但以後 target 變多時，很難知道「這段是誰的」。

現在改成每個 target 有自己的抽屜：

```text
plurk-post-appearance/
  ├─ constants：這個 feature 管哪些 selector
  ├─ menu：右鍵選單長什麼樣子
  └─ styles：如何註冊預設值與產生即時預覽 CSS

timeline-background/
  ├─ constants：這個 feature 管 body
  ├─ menu：河道背景選單
  ├─ styles：body 背景預覽 CSS
  ├─ utils：圖片網址轉 background-image
  └─ wrapper：把 menu、ImageUploader、styles 接在一起
```

這樣以後要找「貼文背景怎麼改」，就進 `plurk-post-appearance`。  
要找「河道背景怎麼改」，就進 `timeline-background`。

---

## 新方法：feature module 的固定分工

一個 style feature 通常拆成三到四種檔案。

### 1. constants：selector 規格

範例：`src/components/preview/plurk-post/plurk-post-appearance/plurk-post-appearance.constants.ts`

```ts
export const PLURK_POST_SELECTOR = ".plurk_cnt";
export const PLURK_POST_NAME_SELECTOR = ".name";
```

新手理解：

- 這裡只回答「我要改哪個 CSS selector？」
- 不放 UI。
- 不放 React state。
- 不放顏色 picker。

好處是 selector 不會散在很多檔案裡。

### 2. styles：註冊預設值 + 即時預覽

範例：`src/components/preview/plurk-post/plurk-post-appearance/plurk-post-appearance-styles.tsx`

```ts
useEffect(() => {
  setInitialBatch(PLURK_POST_SELECTOR, PLURK_POST_STYLE_DEFAULTS);
}, [setInitialBatch]);
```

新手理解：

- `setInitialBatch()` 是告訴 store：「這個 selector 一開始有哪些預設值」。
- 之後使用者修改，store 才知道哪些是 manual changes。
- 匯出 CSS 時，registered 預設值不會輸出，manual / imported 才會輸出。

即時預覽則會產生高權重 CSS：

```ts
body#pcg .plurk_cnt.plurk_cnt.plurk_cnt {
  background-color: ...
}
```

為什麼要這樣？

因為預覽區本身已有很多 base CSS。使用者手動調整後，必須用更高權重蓋過 base CSS，畫面才會即時變化。

### 3. menu：右鍵選單

範例：`src/components/preview/plurk-post/plurk-post-appearance/plurk-post-appearance-menu.tsx`

```tsx
const bgColor = useStyleProp(PLURK_POST_SELECTOR, "backgroundColor");

<ColorPicker
  value={cssValueToString(bgColor.value)}
  onChange={(v) => bgColor.set(v)}
/>
```

新手理解：

- menu 負責「讓使用者操作」。
- menu 直接用 `useStyleProp()` 讀寫 store。
- menu 不負責注入 CSS。
- 即時預覽 CSS 交給同 feature 的 `styles.tsx`。

### 4. wrapper：需要長期存在的 UI 狀態

河道背景比較特別，因為它有 `ImageUploader` dialog。  
dialog 不能放在 context menu content 裡，因為右鍵選單關閉時 content 會 unmount，dialog 也可能跟著消失。

所以 `timeline-background.tsx` 做成 wrapper：

```text
TimelineBackground
  ├─ TimelineBackgroundStyles
  ├─ ImageUploader
  └─ ContextMenu
      └─ TimelineBackgroundMenu
```

新手理解：

- wrapper 負責「要長期活著的東西」。
- menu 只負責顯示按鈕。
- styles 負責預覽 CSS。
- uploader dialog 狀態放在 wrapper，才不會因選單關閉而消失。

---

## 舊方法的邏輯是什麼

舊方法不是錯，只是當 feature 變多時會越來越難管理。

### 舊貼文方法

以前 `PlurkPost` 同時做很多事：

```ts
setInitialBatch(".plurk_cnt", PLURK_POST_STYLE_DEFAULTS);

const bgColor = useStyleProp(".plurk_cnt", "backgroundColor");
const border = useStyleProp(".plurk_cnt", "border");

const bgColorChanged = bgColor.value !== bgColor.initial;
```

然後再把資料傳給：

- `PlurkPostStyles`
- `PlurkPostContextMenuContent`

簡化成圖：

```text
PlurkPost
  ├─ 註冊 defaults
  ├─ 讀 store
  ├─ 算 changed
  ├─ 傳給 styles
  └─ 傳給 menu
```

問題是：`PlurkPost` 本來應該主要負責「預覽一則噗」，但它開始知道太多 editor 細節。

### 舊河道背景方法

以前 `page.tsx` 同時做：

```ts
setInitialBatch("body", BODY_STYLE_DEFAULTS);
const backgroundImage = useStyleProp("body", "backgroundImage");
const [backgroundDialogOpen, setBackgroundDialogOpen] = useState(false);
```

再把值傳給：

- `EditorPageStyle`
- `ImageUploader`
- 河道 context menu

簡化成圖：

```text
page.tsx
  ├─ 註冊 body defaults
  ├─ 讀 body background props
  ├─ 管 ImageUploader open state
  ├─ 產生 EditorPageStyle props
  └─ 渲染河道 menu
```

問題是：`page.tsx` 本來應該負責「整頁 layout 與資料匯入/草稿」，但它也開始管理某個具體 CSS target。

---

## 新方法後，父層變簡單

現在 `PlurkPost` 不需要知道 `.plurk_cnt` 背景怎麼設定，只需要掛 feature：

```tsx
{!skipStyles && (
  <>
    <PlurkPostStyles />
    <PlurkPostAppearanceStyles />
  </>
)}
```

貼文 menu 也只負責組裝：

```tsx
<EditorMenuTitle>貼文</EditorMenuTitle>
<PlurkPostAppearanceMenu />
<EditorMenuSectionLabel>其他區塊</EditorMenuSectionLabel>
<ResponseCountMenu />
```

`page.tsx` 不再直接管理 `body` 背景，而是：

```tsx
<TimelineBackground isLoggingIn={isLoggingIn}>
  <PlurkTimeline />
  <PlurkTimelineControl />
</TimelineBackground>
```

新手理解：

- 父層只放「這裡有哪些功能」。
- feature 自己處理「這個功能怎麼運作」。

---

## 新增下一個 style feature 時可以照抄

假設以後要做「貼文時間」編輯器，可以照這樣開資料夾：

```text
plurk-time/
  ├─ plurk-time.constants.ts
  ├─ plurk-time-menu.tsx
  └─ plurk-time-styles.tsx
```

最小範例：

```ts
// plurk-time.constants.ts
export const PLURK_TIME_SELECTOR = ".time";
```

```tsx
// plurk-time-styles.tsx
useEffect(() => {
  setInitialBatch(PLURK_TIME_SELECTOR, {
    color: "#999",
    fontSize: "10px",
  });
}, [setInitialBatch]);

const color = useStyleProp(PLURK_TIME_SELECTOR, "color");
```

```tsx
// plurk-time-menu.tsx
const color = useStyleProp(PLURK_TIME_SELECTOR, "color");

<ColorPicker
  value={cssValueToString(color.value)}
  onChange={(v) => color.set(v)}
/>
```

最後在貼文 menu 裡掛：

```tsx
<PlurkTimeMenu />
```

在某個常駐位置掛：

```tsx
<PlurkTimeStyles />
```

---

## response-count 匯出特例：新手版流程

`response-count` 比較特別，因為 Plurk 實站測試時，一般 selector 與 `.new` selector 只靠普通順序不夠穩。

相關紀錄在：

- `docs/issue-records/response-count-export-override.md`

### 1. 編輯器內 store 長這樣

共通徽章：

```css
.timeline-cnt .response_count {
  background-color: ...;
  color: ...;
  border-radius: ...;
}
```

未讀徽章：

```css
.timeline-cnt .new .response_count {
  background-color: ...;
  color: ...;
}
```

### 2. 預覽時

`response-count-styles.tsx` 會產生高權重預覽 CSS：

```css
body#pcg .timeline-cnt .response_count.response_count {
  background-color: ...;
}

body#pcg .timeline-cnt .new .response_count.response_count {
  background-color: ...;
}
```

新手理解：

- 這只影響編輯器預覽。
- 不代表最後匯出的 selector 長這樣。
- 預覽需要比較高權重，才不會被內建 CSS 蓋掉。

### 3. 匯出時

`styleManager.getAllStyles()` 會偵測：

- `.timeline-cnt .response_count`
- `.timeline-cnt .new .response_count`

只要其中一個有要匯出的內容，就走 response-count 特例。

目前策略是輸出三段：

```css
/* [RESPONSE_COUNT_RESET] ... */
.timeline-cnt .response_count {
  ...
}

/* common final */
.timeline-cnt .response_count {
  ...
}

/* state override */
.timeline-cnt .new .response_count {
  ...
}
```

新手理解：

- 第一段 reset：先把共通樣式打底。
- 第二段 common final：再確認共通樣式最後狀態。
- 第三段 state override：最後讓 `.new` 未讀狀態覆寫共通背景與文字色。

純 CSS 理論上不一定需要兩段共通 rule，但 Plurk 實站的注入順序比較不穩，所以保留這個實務策略。

---

## 判斷某個 feature 要放哪裡

### 放進 `plurk-post-appearance`

如果它是貼文本體 `.plurk_cnt` 的樣式，例如：

- 背景色
- 背景圖
- 邊框
- 未來的 padding / box-shadow

### 放進 `timeline-background`

如果它是整個頁面/河道背景，例如：

- 背景圖
- 背景尺寸
- 背景重複
- 背景位置

### 自己開新 feature

如果它是獨立 selector，例如：

- response count
- time
- manager icons
- reactions

就開新的 feature module。

---

## 這次重構後要注意

- `timeline-background` UI 叫河道，但 selector 還是 `body`。
- `PlurkPostStyles` 現在只放固定預覽樣式；使用者可調整的 `.plurk_cnt` 覆寫在 `PlurkPostAppearanceStyles`。
- menu 不應該負責注入 CSS；menu 只負責 `set()` store。
- styles 不應該依賴 menu 是否開啟；需要常駐掛載。
- 如果 feature 有 dialog 或 popover 狀態，要注意不要放在會 unmount 的 context menu content 裡。
