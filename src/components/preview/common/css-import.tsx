"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCSSImporter } from "@/store/styleManager/styleManager";
import { CssValue } from "@/types/css.type";
import { useEffect, useState } from "react";

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

  const cleanCSSComments = (cssString: string) => {
    return cssString.replace(/\/\*[\s\S]*?\*\//g, "");
  };

  const parseCSS = (cssString: string) => {
    const rules: Array<{ selector: string; properties: Record<string, CssValue> }> = [];
    const cleanCSS = cleanCSSComments(cssString);
    const cssRules = cleanCSS.match(/[^}]+}/g) || [];

    cssRules.forEach((rule) => {
      const selectorMatch = rule.match(/^([^{]+)/);
      const propertiesMatch = rule.match(/\{([^}]+)\}/);

      if (selectorMatch && propertiesMatch) {
        const selector = selectorMatch[1].trim();
        const propertiesText = propertiesMatch[1];
        const properties: Record<string, CssValue> = {};
        const propertyPairs = propertiesText.split(";").filter((pair) => pair.trim());

        propertyPairs.forEach((pair) => {
          const [prop, value] = pair.split(":").map((s) => s.trim());
          if (prop && value) {
            const styleKey = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            properties[styleKey] = value;
          }
        });

        if (Object.keys(properties).length > 0) {
          rules.push({ selector, properties });
        }
      }
    });

    return rules;
  };

  const handleConfirm = () => {
    try {
      if (!cssInput.trim()) {
        clearImportedCSS();
        persistImportedSource("");
        return;
      }

      const cssRules = parseCSS(cssInput);
      replaceImportedCSS(cssRules);
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

  const previewCSS = () => {
    if (!cssInput.trim()) return "";

    try {
      const cssRules = parseCSS(cssInput);
      return cssRules
        .map(({ selector, properties }) => {
          const lines = Object.entries(properties).map(([prop, value]) => {
            const cssProp = prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
            return `  ${cssProp}: ${value};`;
          });
          return `${selector} {\n${lines.join("\n")}\n}`;
        })
        .join("\n\n");
    } catch {
      return "CSS 格式錯誤";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>匯入 CSS</DialogTitle>
          <DialogDescription className="sr-only">
            貼上 CSS 後按確認輸入，會覆蓋上一輪匯入樣式。
          </DialogDescription>
        </DialogHeader>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
              貼上 CSS：
            </label>
            <textarea
              value={cssInput}
              onChange={(e) => {
                setCssInput(e.target.value);
                setClearedHint(false);
              }}
              placeholder="在此貼上 CSS 規則…"
              rows={8}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "12px",
                resize: "vertical",
              }}
            />
          </div>

          {cssInput.trim() && (
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
                預覽：
              </label>
              <pre
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  maxHeight: "150px",
                  overflow: "auto",
                  border: "1px solid #ddd",
                }}
              >
                {previewCSS()}
              </pre>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={handleConfirm}
              style={{
                flex: 1,
                padding: "8px 16px",
                backgroundColor: "#FF574D",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              確認輸入
            </button>
            <button
              onClick={handleClearInput}
              style={{
                flex: 1,
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f8f9fa",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              取消並清空輸入
            </button>
          </div>

          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
            預覽僅在按下「確認輸入」後更新。清空輸入欄不會還原已套用的樣式。
            {clearedHint ? " 目前預覽尚未變更。" : ""}
          </p>

          <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
            <button
              onClick={() => {
                setCssInput(EXAMPLE_CSS);
                setClearedHint(false);
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fff",
                color: "#FF574D",
                border: "1px solid #FF574D",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              填入示意範例
            </button>
          </div>

          <div style={{ fontSize: "12px", color: "#666" }}>
            <p><strong>功能說明：</strong></p>
            <ul style={{ listStyle: "disc", paddingLeft: "20px", marginTop: "4px" }}>
              <li>CSS 會直接應用到 preview</li>
              <li>未登錄的元素也能獨立顯示</li>
              <li>相同物件的不同選擇器會覆蓋</li>
              <li>使用「匯出 CSS」匯出樣式</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
