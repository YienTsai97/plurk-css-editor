"use client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCSSImporter } from "@/store/styles/styleManager";
import { CssValue } from "@/types/css.type";
import { useState } from "react";

export const CssImport = () => {
  const [cssInput, setCssInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { importCSS, clearImportedCSS } = useCSSImporter();

  // 清理 CSS 註解
  const cleanCSSComments = (cssString: string) => {
    // 移除 /* */ 註解
    return cssString.replace(/\/\*[\s\S]*?\*\//g, '');
  };

  // 解析 CSS 字串
  const parseCSS = (cssString: string) => {
    const rules: Array<{ selector: string; properties: Record<string, CssValue> }> = [];

    // 先清理註解
    const cleanCSS = cleanCSSComments(cssString);

    const cssRules = cleanCSS.match(/[^}]+}/g) || [];

    cssRules.forEach(rule => {
      const selectorMatch = rule.match(/^([^{]+)/);
      const propertiesMatch = rule.match(/\{([^}]+)\}/);

      if (selectorMatch && propertiesMatch) {
        const selector = selectorMatch[1].trim();
        const propertiesText = propertiesMatch[1];

        const properties: Record<string, CssValue> = {};
        const propertyPairs = propertiesText.split(';').filter(pair => pair.trim());

        propertyPairs.forEach(pair => {
          const [prop, value] = pair.split(':').map(s => s.trim());
          if (prop && value) {
            // 轉換 kebab-case 為 camelCase
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

  // 處理 CSS 導入
  const handleImport = () => {
    if (!cssInput.trim()) return;

    try {
      const cssRules = parseCSS(cssInput);
      importCSS(cssRules);

      setIsOpen(false);
      setCssInput("");

      console.log(`成功導入 ${cssRules.length} 個 CSS 規則`);
    } catch (error) {
      console.error('CSS 解析錯誤:', error);
      alert('CSS 格式錯誤，請檢查語法');
    }
  };

  // 預覽導入的 CSS
  const previewCSS = () => {
    if (!cssInput.trim()) return "";

    try {
      const cssRules = parseCSS(cssInput);
      return cssRules.map(({ selector, properties }) => {
        const lines = Object.entries(properties).map(([prop, value]) => {
          const cssProp = prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
          return `  ${cssProp}: ${value};`;
        });
        return `${selector} {\n${lines.join('\n')}\n}`;
      }).join('\n\n');
    } catch {
      return "CSS 格式錯誤";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button style={{
          position: "fixed",
          bottom: "20px",
          right: "140px",
          backgroundColor: "#fef123",
          padding: "8px 16px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px"
        }}>
          Import CSS Style
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-4" style={{ maxHeight: "500px", overflow: "auto", zIndex: 1000 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Import Custom CSS</h3>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Paste your CSS here:
            </label>
            <textarea
              value={cssInput}
              onChange={(e) => setCssInput(e.target.value)}
              placeholder="Enter CSS rules..."
              rows={8}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* 預覽區域 */}
          {cssInput.trim() && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Preview:
              </label>
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '11px',
                maxHeight: '150px',
                overflow: 'auto',
                border: '1px solid #ddd'
              }}>
                {previewCSS()}
              </pre>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleImport}
              disabled={!cssInput.trim()}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: cssInput.trim() ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: cssInput.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              Import CSS
            </button>

            <button
              onClick={() => {
                const testCSS = `.name { color: #FF0000 !important; }`;
                setCssInput(testCSS);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              title="載入測試 CSS：.name { color: #FF0000 !important; }"
            >
              Test CSS
            </button>

            <button
              onClick={() => {
                clearImportedCSS();
                setCssInput("");
                alert('已清除所有導入的 CSS 樣式');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              title="清除所有已導入的 CSS 樣式"
            >
              Clear CSS
            </button>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </div>

          <div style={{ fontSize: '12px', color: '#666' }}>
            <p><strong>功能說明：</strong></p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '4px' }}>
              <li>CSS 會直接應用到 preview</li>
              <li>未登錄的元素也能獨立顯示</li>
              <li>相同物件的不同選擇器會覆蓋</li>
              <li>使用右側 Export CSS 按鈕導出樣式</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

