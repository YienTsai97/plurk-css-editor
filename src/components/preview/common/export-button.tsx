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

/** 用途：在 copy 事件強制寫入指定文字。http://192.168.x.x 不是 secure context，Clipboard API 不能用；這條路才是按鈕本身的複製，不是給使用者看的備援框。 */
const copyWithExecCommand = (text: string) => {
  const host =
    document.querySelector<HTMLElement>("[data-slot='dialog-content']") ?? document.body;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.setAttribute("aria-hidden", "true");
  textarea.tabIndex = -1;
  Object.assign(textarea.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "1px",
    height: "1px",
    padding: "0",
    border: "0",
    outline: "none",
    opacity: "0",
  });

  let wrote = false;
  const onCopy = (event: ClipboardEvent) => {
    event.clipboardData?.setData("text/plain", text);
    event.preventDefault();
    wrote = true;
  };

  host.appendChild(textarea);
  document.addEventListener("copy", onCopy);
  try {
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const copied = document.execCommand("copy");
    return Boolean(copied || wrote);
  } catch {
    return wrote;
  } finally {
    document.removeEventListener("copy", onCopy);
    textarea.remove();
  }
};

/** 用途：先用 execCommand 寫入（區網 IP／http 也要能複製），secure context 再補 Clipboard API。 */
const writeToClipboard = async (text: string) => {
  if (copyWithExecCommand(text)) return true;
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

/** 用途：匯出對話框。先選複製／下載／分享，按按鈕後才執行，避免點開選單就複製。 */
export const ExportButton = ({ open, onOpenChange }: ExportButtonProps) => {
  const { getAllStyles } = useCSSImporter();
  const [includeComments, setIncludeComments] = useState(true);
  const [exportFormat, setExportFormat] = useState<"copy" | "download" | "share">("copy");

  const handleExport = async () => {
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
          await copyToClipboard(fullOutput);
          break;
        case "download":
          downloadCSS(fullOutput);
          break;
        case "share":
          await generateShareLink(fullOutput);
          break;
      }
    } catch (error) {
      console.error("CSS 導出錯誤:", error);
      alert("CSS 匯出失敗");
    }
  };

  const copyToClipboard = async (text: string) => {
    const copied = await writeToClipboard(text);
    if (copied) {
      alert(`CSS 已複製到剪貼簿！${includeComments ? "（包含註解）" : "（純 CSS）"}`);
    } else {
      alert("無法寫入剪貼簿，請改用「下載 .css 檔案」。");
    }
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

  const generateShareLink = async (css: string) => {
    try {
      const encodedCSS = encodeURIComponent(css);
      const shareUrl = `${window.location.origin}/editor?import=${encodedCSS}`;

      const copied = await writeToClipboard(shareUrl);
      if (copied) {
        alert("分享連結已複製到剪貼簿！\n\n其他人可以使用這個連結來載入你的樣式。");
      } else {
        alert("無法寫入剪貼簿，請改用「下載 .css 檔案」。");
      }
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
