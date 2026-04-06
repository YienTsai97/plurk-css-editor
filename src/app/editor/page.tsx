"use client";

import { SaveProjectButton } from "@/components/editor/save-project-button";
import { CssImport } from "@/components/preview/common/css-import";
import { ExportButton } from "@/components/preview/common/export-button";
import { PlurkDashboard } from "@/components/preview/plurk-dashboard/plurk-dashboard";
import { PlurkFooter } from "@/components/preview/plurk-footer";
import { PlurkTimeline } from "@/components/preview/plurk-timeline/plurk-timeline";
import { PlurkTimelineControl } from "@/components/preview/plurk-timeline/plurk-timeline-control";
import { PlurkTopBar } from "@/components/preview/plurk-top-bar";
import { useCSSImporter } from "@/store/styleManager/styleManager";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditorPage = () => {
  const searchParams = useSearchParams();
  const { importCSS, getAllStyles } = useCSSImporter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActionDockOpen, setIsActionDockOpen] = useState(false);

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
  const parseCSS = (cssString: string) => {
    const rules: Array<{ selector: string; properties: Record<string, any> }> =
      [];

    // 移除註解
    const cleanCSS = cssString.replace(/\/\*[\s\S]*?\*\//g, "");

    const cssRules = cleanCSS.match(/[^}]+}/g) || [];

    cssRules.forEach((rule) => {
      const selectorMatch = rule.match(/^([^{]+)/);
      const propertiesMatch = rule.match(/\{([^}]+)\}/);

      if (selectorMatch && propertiesMatch) {
        const selector = selectorMatch[1].trim();
        const propertiesText = propertiesMatch[1];

        const properties: Record<string, any> = {};
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
        const { css, timestamp } = JSON.parse(savedDraft);
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

  return (
    <>
      <style>
        {`
          body {
            background: #eeebf0;
            color: #333;
            /*以下為新添背景圖片設定，可自行修改*/
             background-image: url("https://static.vecteezy.com/system/resources/thumbnails/049/855/471/small/nature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-free-photo.jpg") !important;
            background-size: cover;        /* 強制滿版*/
            background-position: center;   /* 置中裁切 */
            background-repeat: no-repeat;
            background-attachment: fixed;  /* 可選：滾動時背景不動 */
          }
          body.language-large-font {
            font-size: 13px;
          }
          body, #layout_content_html, #layout_content {
            overflow-x: hidden;
          }
          body {
            overflow-y: scroll;
          }
          body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td {
            margin: 0;
            padding: 0;
          }
          body.language-large-font {
            font-size: 13px;
          }
          #layout_content {
            padding-top: 42px;
            position: relative;
          }
          .clearfix {
            clear: both;
          }
          .clearfix::after {
            content: '';
            clear: both;
            width: 0px;
            height: 0px;
            display: block;
            line-height: 0px;
            font-size: 0px;
          }
          i {
            font-style: normal;
          }

        `}
      </style>

      <div id="layout_body">
        <PlurkTopBar />
        <div id="layout_content_html" className="_lch_">
          <div id="layout_content" className="_lc_ clearfix">
            <PlurkTimeline />
            <PlurkTimelineControl />
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
        </div>
      </div>
    </>
  );
};

export default EditorPage;
