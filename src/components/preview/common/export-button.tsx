"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCSSImporter } from "@/store/styleManager/styleManager";
import { useState } from "react";

type ExportButtonProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ExportButton = ({ open, onOpenChange }: ExportButtonProps) => {
  const { getAllStyles } = useCSSImporter();
  const [includeComments, setIncludeComments] = useState(true);
  const [exportFormat, setExportFormat] = useState<"copy" | "download" | "share">("copy");

  const handleExport = () => {
    try {
      const { css, tags } = getAllStyles();

      let fullOutput: string;
      if (includeComments) {
        fullOutput = `${tags.join("\n")}\n\n${css}`;
      } else {
        const cleanCSS = css.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, "").trim();
        fullOutput = cleanCSS;
      }

      switch (exportFormat) {
        case "copy":
          copyToClipboard(fullOutput);
          break;
        case "download":
          downloadCSS(fullOutput);
          break;
        case "share":
          generateShareLink(fullOutput);
          break;
      }
    } catch (error) {
      console.error("CSS 導出錯誤:", error);
      alert("CSS 匯出失敗");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`CSS 已複製到剪貼簿！${includeComments ? "（包含註解）" : "（純 CSS）"}`);
    }).catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert(`CSS 已複製到剪貼簿！${includeComments ? "（包含註解）" : "（純 CSS）"}`);
    });
  };

  const downloadCSS = (css: string) => {
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plurk-styles-${new Date().toISOString().slice(0, 10)}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("CSS 檔案已下載！");
  };

  const generateShareLink = (css: string) => {
    try {
      const encodedCSS = encodeURIComponent(css);
      const shareUrl = `${window.location.origin}/editor?import=${encodedCSS}`;

      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("分享連結已複製到剪貼簿！\n\n其他人可以使用這個連結來載入你的樣式。");
      }).catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("分享連結已複製到剪貼簿！\n\n其他人可以使用這個連結來載入你的樣式。");
      });
    } catch (error) {
      console.error("生成分享連結失敗:", error);
      alert("生成分享連結失敗");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>匯出 CSS</DialogTitle>
          <DialogDescription className="sr-only">
            選擇複製、下載或產生分享連結後再執行匯出。
          </DialogDescription>
        </DialogHeader>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                name="exportFormat"
                value="copy"
                checked={exportFormat === "copy"}
                onChange={() => setExportFormat("copy")}
              />
              <span>複製到剪貼簿</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                name="exportFormat"
                value="download"
                checked={exportFormat === "download"}
                onChange={() => setExportFormat("download")}
              />
              <span>下載 .css 檔案</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                name="exportFormat"
                value="share"
                checked={exportFormat === "share"}
                onChange={() => setExportFormat("share")}
              />
              <span>生成分享連結</span>
            </label>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px" }}>
            <input
              type="checkbox"
              checked={includeComments}
              onChange={(e) => setIncludeComments(e.target.checked)}
            />
            <span>包含註解（標記來源）</span>
          </label>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "12px",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <p style={{ margin: "0 0 8px 0" }}><strong>匯出選項說明：</strong></p>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li><strong>複製到剪貼簿：</strong> 直接複製 CSS 到剪貼簿</li>
              <li><strong>下載 .css 檔案：</strong> 下載 CSS 檔案到本地</li>
              <li><strong>生成分享連結：</strong> 創建可分享的 URL</li>
            </ul>
          </div>

          <button
            onClick={handleExport}
            style={{
              width: "100%",
              padding: "10px 16px",
              backgroundColor: "#FF574D",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {exportFormat === "copy" && "複製 CSS"}
            {exportFormat === "download" && "下載 CSS 檔案"}
            {exportFormat === "share" && "生成分享連結"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
