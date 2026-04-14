"use client";

import ImageUploader from "@/components/controllers/ImageUploader";
import { SaveProjectButton } from "@/components/editor/save-project-button";
import { CssImport } from "@/components/preview/common/css-import";
import { ExportButton } from "@/components/preview/common/export-button";
import { PlurkDashboard } from "@/components/preview/plurk-dashboard/plurk-dashboard";
import { PlurkFooter } from "@/components/preview/plurk-footer";
import { PlurkTimeline } from "@/components/preview/plurk-timeline/plurk-timeline";
import { PlurkTimelineControl } from "@/components/preview/plurk-timeline/plurk-timeline-control";
import { PlurkTopBar } from "@/components/preview/plurk-top-bar";
import { BODY_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useCSSImporter, useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { CssValue } from "@/types/css.type";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { EditorPageStyle } from "./page.style";

type ParsedCssRule = { selector: string; properties: Record<string, CssValue> };

/** 將圖片網址轉成 CSS background-image 可用的值 */
function toBackgroundImageCssValue(href: string): string {
  const v = href.trim();
  if (v === "" || v === "none") return "none";
  if (v.includes('"')) {
    return `url('${v.replace(/'/g, "\\'")}')`;
  }
  return `url("${v}")`;
}

const EditorPageContent = () => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoggingIn = status === "authenticated";
  const { importCSS, getAllStyles } = useCSSImporter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActionDockOpen, setIsActionDockOpen] = useState(false);
  const [backgroundDialogOpen, setBackgroundDialogOpen] = useState(false);

  // 處理 URL 匯入
  useEffect(() => {
    const importParam = searchParams.get("import");
    if (importParam) {
      try {
        // 嘗試解析 import 參數
        if (importParam.startsWith("http")) {
          // 如果是 URL，可以未來實作 fetch
          console.log("URL import:", importParam);
        } else {
          // 如果是 CSS 內容，直接匯入
          const decodedCSS = decodeURIComponent(importParam);
          const cssRules = parseCSS(decodedCSS);
          importCSS(cssRules);
          console.log("CSS import from URL:", cssRules.length, "rules");
        }
      } catch (error) {
        console.error("URL import error:", error);
      }
    }

    // 載入 localStorage 草稿
    loadDraft();
    setIsLoaded(true);
  }, [searchParams, importCSS]);

  // 解析 CSS 字串
  const parseCSS = (cssString: string): ParsedCssRule[] => {
    const rules: ParsedCssRule[] = [];

    // 移除註解
    const cleanCSS = cssString.replace(/\/\*[\s\S]*?\*\//g, "");

    const cssRules = cleanCSS.match(/[^}]+}/g) || [];

    cssRules.forEach((rule) => {
      const selectorMatch = rule.match(/^([^{]+)/);
      const propertiesMatch = rule.match(/\{([^}]+)\}/);

      if (selectorMatch && propertiesMatch) {
        const selector = selectorMatch[1].trim();
        const propertiesText = propertiesMatch[1];

        const properties: Record<string, CssValue> = {};
        const propertyPairs = propertiesText
          .split(";")
          .filter((pair) => pair.trim());

        propertyPairs.forEach((pair) => {
          const [prop, value] = pair.split(":").map((s) => s.trim());
          if (prop && value) {
            const styleKey = prop.replace(/-([a-z])/g, (g) =>
              g[1].toUpperCase(),
            );
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

  // 載入 localStorage 草稿
  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem("plurk-css-editor-draft");
      if (savedDraft) {
        const { css } = JSON.parse(savedDraft);
        const cssRules = parseCSS(css);
        importCSS(cssRules);
        console.log(
          "Loaded draft from localStorage:",
          cssRules.length,
          "rules",
        );
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  // 自動儲存草稿
  useEffect(() => {
    if (!isLoaded) return;

    const saveDraft = () => {
      try {
        const { css } = getAllStyles();
        const draft = {
          css,
          timestamp: Date.now(),
        };
        localStorage.setItem("plurk-css-editor-draft", JSON.stringify(draft));
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    };

    // 每 30 秒自動儲存
    const interval = setInterval(saveDraft, 30000);

    // 頁面卸載時儲存
    const handleBeforeUnload = () => {
      saveDraft();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveDraft(); // 最後一次儲存
    };
  }, [isLoaded, getAllStyles]);

  const setInitialBatch = useStyleManager(s => s.setInitialBatch);
  useEffect(() => {
    setInitialBatch("body", BODY_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  const backgroundImage = useStyleProp("body", "backgroundImage");
  const backgroundSize = useStyleProp("body", "backgroundSize");
  const backgroundRepeat = useStyleProp("body", "backgroundRepeat");
  const backgroundPosition = useStyleProp("body", "backgroundPosition");
  const backgroundAttachment = useStyleProp("body", "backgroundAttachment");

  const backgroundImageChanged =
    backgroundImage.value !== backgroundImage.initial &&
    backgroundImage.value !== "none";
  const backgroundSizeChanged =
    backgroundSize.value !== backgroundSize.initial;
  const backgroundRepeatChanged =
    backgroundRepeat.value !== backgroundRepeat.initial;
  return (
    <>
      <EditorPageStyle
        backgroundImage={backgroundImage.value as CssValue}
        backgroundSize={backgroundSize.value as CssValue}
        backgroundRepeat={backgroundRepeat.value as CssValue}
        backgroundPosition={backgroundPosition.value as CssValue}
        backgroundAttachment={backgroundAttachment.value as CssValue}
        backgroundImageChanged={backgroundImageChanged}
        backgroundSizeChanged={backgroundSizeChanged}
        backgroundRepeatChanged={backgroundRepeatChanged}
      />

      <ImageUploader
        showTrigger={false}
        open={backgroundDialogOpen}
        onOpenChange={setBackgroundDialogOpen}
        isLoggingIn={isLoggingIn}
        onUploadedUrl={(url) => {
          const v = toBackgroundImageCssValue(url);
          backgroundImage.set(v);
          backgroundSize.set(BODY_STYLE_DEFAULTS.backgroundSize);
          backgroundRepeat.set(BODY_STYLE_DEFAULTS.backgroundRepeat);
        }}
        onResetBackground={() => {
          backgroundImage.set(backgroundImage.initial ?? BODY_STYLE_DEFAULTS.backgroundImage);
          backgroundSize.set(backgroundSize.initial ?? BODY_STYLE_DEFAULTS.backgroundSize);
          backgroundRepeat.set(backgroundRepeat.initial ?? BODY_STYLE_DEFAULTS.backgroundRepeat);
        }}
      />

      <div id="layout_body">
        <PlurkTopBar />
        <div id="layout_content_html" className="_lch_">
          <div id="layout_content" className="_lc_ clearfix">
            <ContextMenu>
              <ContextMenuTrigger>
                <PlurkTimeline />
                <PlurkTimelineControl />
              </ContextMenuTrigger>
              <ContextMenuContent style={{ zIndex: 1300, minWidth: 200, padding: 4 }}>
                <ContextMenuItem
                  style={{
                    padding: "8px 12px",
                    fontSize: 13,
                    borderRadius: 6,
                    cursor: "pointer",
                    outline: "none",
                    backgroundColor: "#ffffff",
                    color: "#374151",
                    border: "1px solid #e5e7eb",
                  }}
                  onSelect={() => setBackgroundDialogOpen(true)}
                >
                  更換背景圖
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            <PlurkDashboard />
            <PlurkFooter />
            {/* toggle button group */}
            <div
              style={{
                position: "fixed",
                right: "16px",
                bottom: "16px",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "10px",
              }}
              onMouseEnter={() => setIsActionDockOpen(true)}
              onMouseLeave={() => setIsActionDockOpen(false)}
            >
              <button
                onClick={() => setIsActionDockOpen((prev) => !prev)}
                title="功能選單"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor: "#FF574D",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "18px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                ...
              </button>

              {isActionDockOpen && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <ExportButton layout="inline" />
                  <CssImport layout="inline" />
                  <SaveProjectButton layout="inline" />
                </div>
              )}
            </div>
          </div>
        </div >
      </div >
    </>
  );
};

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontSize: "16px",
            color: "#666",
          }}
        >
          載入編輯器…
        </div>
      }
    >
      <EditorPageContent />
    </Suspense>
  );
}
