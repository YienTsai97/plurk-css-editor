"use client";

import { EditorIoDock } from "@/components/editor/editor-io-dock";
import { PlurkDashboard } from "@/components/preview/plurk-dashboard/plurk-dashboard";
import { PlurkFooter } from "@/components/preview/plurk-footer";
import { PlurkTimeline } from "@/components/preview/plurk-timeline/plurk-timeline";
import { PlurkTimelineControl } from "@/components/preview/plurk-timeline/plurk-timeline-control";
import { ResponseCountStyles } from "@/components/preview/plurk-timeline/response-count/response-count-styles";
import { TimelineBackground } from "@/components/preview/plurk-timeline/timeline-background/timeline-background";
import { PlurkTopBar } from "@/components/preview/plurk-top-bar";
import { useCSSImporter } from "@/store/styleManager/styleManager";
import { analyzeImportedCss } from "@/utils/parseCssImport";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const EditorPageContent = () => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isLoggingIn = status === "authenticated";
  const { importCSS, getAllStyles } = useCSSImporter();
  const [isLoaded, setIsLoaded] = useState(false);
  const skipDraftSaveRef = useRef(false);

  // 用途：?import= 與 localStorage 草稿都走同一套 parser，避免 url(https://...) 被截斷。
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
          const cssRules = analyzeImportedCss(decodedCSS).rules;
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

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem("plurk-css-editor-draft");
      if (savedDraft) {
        const { css } = JSON.parse(savedDraft);
        const cssRules = analyzeImportedCss(css).rules;
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
        const hasStyles = Boolean(css.trim());

        // 回復模板後略過一次寫回；若使用者立刻再匯入，hasStyles 為真則照常存草稿。
        if (skipDraftSaveRef.current) {
          skipDraftSaveRef.current = false;
          if (!hasStyles) {
            localStorage.removeItem("plurk-css-editor-draft");
            return;
          }
        }

        if (!hasStyles) {
          localStorage.removeItem("plurk-css-editor-draft");
          return;
        }

        const draft = {
          css,
          timestamp: Date.now(),
        };
        localStorage.setItem("plurk-css-editor-draft", JSON.stringify(draft));
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    };

    const interval = setInterval(saveDraft, 30000);

    const handleBeforeUnload = () => {
      saveDraft();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveDraft();
    };
  }, [isLoaded, getAllStyles]);

  return (
    <>
      {/* 用途：常駐掛載 response_count 的 store 註冊與高權重預覽 CSS，不能依賴右鍵選單是否開啟。 */}
      <ResponseCountStyles />

      <div id="layout_body">
        <PlurkTopBar />
        <div id="layout_content_html" className="_lch_">
          <div id="layout_content" className="_lc_ clearfix">
            <TimelineBackground isLoggingIn={isLoggingIn}>
              <PlurkTimeline />
              <PlurkTimelineControl />
            </TimelineBackground>
            <PlurkDashboard />
            <PlurkFooter />
            <EditorIoDock
              // 用途：回復模板後略過一次草稿寫回，避免剛清空又被 autosave 存回去。
              onSkipDraftSave={() => {
                skipDraftSaveRef.current = true;
              }}
            />
          </div>
        </div>
      </div>
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
