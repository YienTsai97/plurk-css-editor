"use client"

import { useCSSImporter } from "@/store/styles/styleManager";
import { useState } from "react";

export const ExportButton = () => {
  const { getAllStyles } = useCSSImporter();
  const [includeComments, setIncludeComments] = useState(true);

  const handleExport = () => {
    try {
      const { css, tags } = getAllStyles();

      let fullOutput: string;
      if (includeComments) {
        // 完整導出：包含註解和標記
        fullOutput = `${tags.join('\n')}\n\n${css}`;
      } else {
        // 純 CSS 導出：移除所有註解，只包含 CSS 規則
        const cleanCSS = css.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '').trim();
        fullOutput = cleanCSS;
      }

      // 複製到剪貼簿
      navigator.clipboard.writeText(fullOutput).then(() => {
        alert(`CSS 已複製到剪貼簿！${includeComments ? '（包含註解）' : '（純 CSS）'}`);
      }).catch(() => {
        // 如果剪貼簿 API 不可用，顯示彈窗
        const textArea = document.createElement('textarea');
        textArea.value = fullOutput;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(`CSS 已複製到剪貼簿！${includeComments ? '（包含註解）' : '（純 CSS）'}`);
      });
    } catch (error) {
      console.error('CSS 導出錯誤:', error);
      alert('CSS 導出失敗');
    }
  };

  const toggleComments = () => {
    setIncludeComments(!includeComments);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      alignItems: "flex-end"
    }}>
      {/* 註解切換按鈕 */}
      <button
        onClick={toggleComments}
        style={{
          backgroundColor: includeComments ? "#28a745" : "#6c757d",
          color: "white",
          padding: "4px 8px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px",
          minWidth: "80px"
        }}
        title={includeComments ? "點擊切換為純 CSS 導出" : "點擊切換為完整導出（包含註解）"}
      >
        {includeComments ? "含註解" : "純 CSS"}
      </button>

      {/* 主要導出按鈕 */}
      <button
        onClick={handleExport}
        style={{
          backgroundColor: "#fef123",
          padding: "8px 16px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          minWidth: "100px"
        }}
        title={`點擊導出 CSS${includeComments ? '（包含註解和標記）' : '（純 CSS 規則）'}`}
      >
        Export CSS
      </button>
    </div>
  );
};