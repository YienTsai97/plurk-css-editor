"use client"

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCSSImporter } from "@/store/styleManager/styleManager";
import { analyzeImportedCss } from "@/utils/parseCssImport";
import { useEffect, useMemo, useState } from "react";

export const IMPORTED_CSS_SOURCE_KEY = "plurk-css-editor-imported-source";

const EXAMPLE_CSS = `.plurk_cnt {
  outline: 3px dashed #FF574D;
}`;

type CssImportProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  textareaResetToken?: number;
};

export const CssImport = ({
  open,
  onOpenChange,
  textareaResetToken = 0,
}: CssImportProps) => {
  const [cssInput, setCssInput] = useState("");
  const [clearedHint, setClearedHint] = useState(false);
  const { replaceImportedCSS, clearImportedCSS } = useCSSImporter();

  const analysis = useMemo(() => analyzeImportedCss(cssInput), [cssInput]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(IMPORTED_CSS_SOURCE_KEY);
      if (saved) setCssInput(saved);
    } catch {
      // ignore storage errors
    }
  }, []);

  const persistImportedSource = (value: string) => {
    try {
      if (value.trim()) localStorage.setItem(IMPORTED_CSS_SOURCE_KEY, value);
      else localStorage.removeItem(IMPORTED_CSS_SOURCE_KEY);
    } catch {
      // ignore storage errors
    }
  };

  useEffect(() => {
    if (textareaResetToken === 0) return;
    setCssInput("");
    setClearedHint(false);
  }, [textareaResetToken]);

  const handleConfirm = () => {
    try {
      if (!cssInput.trim()) {
        clearImportedCSS();
        persistImportedSource("");
        return;
      }

      const { rules } = analysis;
      replaceImportedCSS(rules);
      persistImportedSource(cssInput);
    } catch (error) {
      console.error("CSS 解析錯誤:", error);
      alert("CSS 格式錯誤，請檢查語法");
    }
  };

  const handleClearInput = () => {
    setCssInput("");
    setClearedHint(true);
  };

  const hintParts = [
    "/* */ 註解會在匯入時移除。",
    "頁面預覽僅在按下「確認輸入」後更新；若實際匯入內容不同，下方會即時顯示。",
  ];
  if (analysis.commentsWereStripped && !analysis.showReconstructedPreview && analysis.ignored.length === 0) {
    hintParts.unshift("已忽略註解。");
  }
  if (clearedHint) {
    hintParts.push("目前預覽尚未變更。");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>匯入 CSS</DialogTitle>
          <DialogDescription>
            貼上 CSS 後按確認輸入以套用樣式。
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div>
            <textarea
              id="css-import-textarea"
              className="dialog-textarea dialog-textarea-mono"
              value={cssInput}
              onChange={(e) => {
                setCssInput(e.target.value);
                setClearedHint(false);
              }}
              placeholder="在此貼上 CSS 規則…"
              rows={8}
            />
          </div>

          <p className="dialog-hint">{hintParts.join(" ")}</p>

          {cssInput.trim() && analysis.ignored.length > 0 && (
            <div>
              <p className="dialog-label">以下內容不會依原文套用：</p>
              <ul className="dialog-ignored-list">
                {analysis.ignored.map((item, index) => (
                  <li key={`${item.kind}-${index}`}>{item.label}</li>
                ))}
              </ul>
            </div>
          )}

          {cssInput.trim() && analysis.showReconstructedPreview && (
            <div>
              <label className="dialog-label">實際會匯入的內容</label>
              <p className="dialog-hint" style={{ marginBottom: 8 }}>
                匯入不會完全等同於你貼上的原文（註解會移除，無法解析的片段會被忽略或併入選擇器）。
              </p>
              <pre className="dialog-preview">
                {analysis.reconstructed || "（沒有可套用的規則）"}
              </pre>
            </div>
          )}

          <div className="dialog-section-divider">
            <button
              type="button"
              className="dialog-btn-outline"
              onClick={() => {
                setCssInput(EXAMPLE_CSS);
                setClearedHint(false);
              }}
            >
              填入示意範例
            </button>
          </div>

          <div className="dialog-info-box">
            <p><strong>功能說明：</strong></p>
            <ul>
              <li>CSS 會直接應用到 preview</li>
              <li>未登錄的元素也能獨立顯示</li>
              <li>相同物件的不同選擇器會覆蓋</li>
              <li>使用「匯出 CSS」匯出樣式</li>
            </ul>
          </div>
        </DialogBody>

        <DialogFooter>
          <button type="button" className="dialog-btn-secondary" onClick={handleClearInput}>
            取消並清空輸入
          </button>
          <button type="button" className="dialog-btn-primary" onClick={handleConfirm}>
            確認輸入
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
