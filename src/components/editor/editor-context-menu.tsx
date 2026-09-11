"use client";

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

/** 用途：右鍵選單主層／子層共用的直向間距（對齊貼文選單規格）。 */
const EDITOR_MENU_STACK_GAP = 0.5;

/** 用途：統一所有編輯器 context menu / submenu 的外框視覺，避免各入口自行定義造成漂移。 */
const menuSurfaceStyle: CSSProperties = {
  zIndex: 1300,
  minWidth: 210,
  padding: 8,
  backgroundColor: "#ffffff",
  color: "#374151",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
};

/** 用途：主層與子層共用的直向堆疊（flex + gap），作為右鍵選單統一間距規格。 */
const menuStackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: EDITOR_MENU_STACK_GAP,
};

/** 用途：統一可點擊 menu item 的基本尺寸與文字樣式（無邊框，靠 hover 灰底辨識）。 */
const menuItemStyle: CSSProperties = {
  padding: "8px 12px",
  fontSize: 13,
  borderRadius: 6,
  cursor: "pointer",
  outline: "none",
  backgroundColor: "#ffffff",
  color: "#374151",
  border: "none",
};

/** 用途：讓 submenu 觸發列沿用一般 item 外觀，並保留左右對齊與箭頭空間。 */
const subTriggerStyle: CSSProperties = {
  ...menuItemStyle,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
};

/** 用途：提供 hover / focus / open 狀態共用 class，讓不同 trigger 都有一致的淺灰底互動。 */
export const editorMenuTriggerClassName = "editor-menu-trigger-row";

/** 用途：注入 editor menu 專用互動樣式；主選單與子選單都會掛載一次，確保 portal 內容可吃到樣式。 */
const EditorMenuInteractionStyles = () => (
  <style>
    {`
      .${editorMenuTriggerClassName} {
        transition: background-color 120ms ease, color 120ms ease, opacity 120ms ease;
      }

      .${editorMenuTriggerClassName}:hover:not([data-disabled]):not(:disabled),
      .${editorMenuTriggerClassName}:focus-visible:not([data-disabled]):not(:disabled),
      .${editorMenuTriggerClassName}[data-state="open"]:not([data-disabled]):not(:disabled) {
        background-color: #f3f4f6 !important;
      }

      /* 用途：對齊儲存專案按鈕 disabled 的淡化（opacity 0.45），讓使用者知道尚不可點。 */
      .${editorMenuTriggerClassName}[data-disabled],
      .${editorMenuTriggerClassName}:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
    `}
  </style>
);

/** 用途：主層 context menu 外殼，負責統一 surface、直向 gap 與互動 CSS。 */
export const EditorMenuContent = ({
  children,
  style,
  className,
  ...props
}: ComponentProps<typeof ContextMenuContent>) => (
  <ContextMenuContent
    style={{ ...menuSurfaceStyle, ...menuStackStyle, ...style }}
    className={className}
    {...props}
  >
    <EditorMenuInteractionStyles />
    {children}
  </ContextMenuContent>
);

/** 用途：子層 context menu 外殼，維持與主層相同 surface 與直向 gap。 */
export const EditorMenuSubContent = ({
  children,
  style,
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof ContextMenuSubContent>) => (
  <ContextMenuPortal>
    <ContextMenuSubContent
      sideOffset={sideOffset}
      style={{ ...menuSurfaceStyle, ...menuStackStyle, ...style }}
      className={className}
      {...props}
    >
      <EditorMenuInteractionStyles />
      {children}
    </ContextMenuSubContent>
  </ContextMenuPortal>
);

/** 用途：一般可點擊項目，例如河道 menu 的「更換背景圖」。 */
export const EditorMenuItem = ({
  style,
  className,
  ...props
}: ComponentProps<typeof ContextMenuItem>) => (
  <ContextMenuItem
    style={{ ...menuItemStyle, ...style }}
    className={cn(editorMenuTriggerClassName, className)}
    {...props}
  />
);

/** 用途：進入下一層設定的 submenu trigger，例如「回應數徽章（全域）」。 */
export const EditorMenuSubTrigger = ({
  style,
  className,
  ...props
}: ComponentProps<typeof ContextMenuSubTrigger>) => (
  <ContextMenuSubTrigger
    style={{ ...subTriggerStyle, ...style }}
    className={cn(editorMenuTriggerClassName, className)}
    {...props}
  />
);

/** 用途：標示目前 context menu 正在編輯的大區塊，例如「河道」或「貼文」。 */
export const EditorMenuTitle = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      padding: "4px 4px 8px",
      fontSize: 13,
      fontWeight: 700,
      color: "#111827",
    }}
  >
    {children}
  </div>
);

/**
 * 用途：設定欄位標籤（大小、位置、圓角等）共用樣式。
 * 預設含 padding-bottom，讓標籤與控制項之間有固定呼吸空間。
 */
export const editorMenuFieldLabelStyle: CSSProperties = {
  fontSize: 12,
  color: "#374151",
  paddingBottom: 8,
};

/** 用途：設定欄位標籤 span，裝飾圖設定／回應數徽章等子選單共用。 */
export const EditorMenuFieldLabel = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => <span style={{ ...editorMenuFieldLabelStyle, ...style }}>{children}</span>;

/** 用途：標示同一 menu 內的功能群組，例如「共通」「已讀」「未讀」。 */
export const EditorMenuSectionLabel = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      ...editorMenuFieldLabelStyle,
      padding: "4px 4px 8px",
      fontWeight: 600,
      color: "#6b7280",
    }}
  >
    {children}
  </span>
);

/** 用途：不可整列觸發的設定列，適合右側放 input 等原生表單控制項。 */
export const EditorMenuRow = ({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "0 4px",
    }}
  >
    <span style={{ fontSize: 12, color: "#374151" }}>{label}</span>
    {children}
  </div>
);

/**
 * 用途：整排可點 trigger 的基底 style，交給 ColorPicker / BorderEditor 等控制器套用。
 * 規格對齊 EditorMenuItem / EditorMenuSubTrigger（同 padding、字級、無邊框）。
 */
export const editorMenuTriggerStyle: CSSProperties = {
  ...menuItemStyle,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  cursor: "pointer",
  font: "inherit",
  textAlign: "left",
  appearance: "none",
};

/** 用途：整排 trigger 的內文版型，左側是屬性名稱，右側是動作文字。 */
export const EditorMenuTriggerRow = ({
  label,
  actionLabel,
}: {
  label: ReactNode;
  actionLabel: ReactNode;
}) => (
  <>
    <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
    <span style={{ fontSize: 13, color: "#666" }}>{actionLabel}</span>
  </>
);
