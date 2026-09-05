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

  const primaryLabel =
    exportFormat === "copy"
      ? "複製 CSS"
      : exportFormat === "download"
        ? "下載 CSS 檔案"
        : "生成分享連結";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>匯出 CSS</DialogTitle>
          <DialogDescription>
            選擇複製、下載或產生分享連結後再執行匯出。
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="dialog-option-group">
            <label className={`dialog-option-card${exportFormat === "copy" ? " is-selected" : ""}`}>
              <input
                type="radio"
                name="exportFormat"
                value="copy"
                checked={exportFormat === "copy"}
                onChange={() => setExportFormat("copy")}
              />
              <span>複製到剪貼簿</span>
            </label>

            <label className={`dialog-option-card${exportFormat === "download" ? " is-selected" : ""}`}>
              <input
                type="radio"
                name="exportFormat"
                value="download"
                checked={exportFormat === "download"}
                onChange={() => setExportFormat("download")}
              />
              <span>下載 .css 檔案</span>
            </label>

            <label className={`dialog-option-card${exportFormat === "share" ? " is-selected" : ""}`}>
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

          <label className="dialog-checkbox-row">
            <input
              type="checkbox"
              checked={includeComments}
              onChange={(e) => setIncludeComments(e.target.checked)}
            />
            <span>包含註解（標記來源）</span>
          </label>

          <div className="dialog-info-box">
            <p><strong>匯出選項說明：</strong></p>
            <ul>
              <li><strong>複製到剪貼簿：</strong> 直接複製 CSS 到剪貼簿</li>
              <li><strong>下載 .css 檔案：</strong> 下載 CSS 檔案到本地</li>
              <li><strong>生成分享連結：</strong> 創建可分享的 URL</li>
            </ul>
          </div>
        </DialogBody>

        <DialogFooter>
          <button
            type="button"
            className="dialog-btn-secondary"
            onClick={() => onOpenChange(false)}
          >
            取消
          </button>
          <button type="button" className="dialog-btn-primary" onClick={handleExport}>
            {primaryLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
