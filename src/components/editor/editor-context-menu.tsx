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

/** 用途：統一可點擊 menu item 的基本尺寸、邊框與文字樣式。 */
const menuItemStyle: CSSProperties = {
  padding: "8px 12px",
  fontSize: 13,
  borderRadius: 6,
  cursor: "pointer",
  outline: "none",
  backgroundColor: "#ffffff",
  color: "#374151",
  border: "1px solid #e5e7eb",
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
        transition: background-color 120ms ease, color 120ms ease;
      }

      .${editorMenuTriggerClassName}:hover,
      .${editorMenuTriggerClassName}:focus-visible,
      .${editorMenuTriggerClassName}[data-state="open"] {
        background-color: #f3f4f6 !important;
      }
    `}
  </style>
);

/** 用途：主層 context menu 外殼，負責統一 surface 樣式與互動 CSS。 */
export const EditorMenuContent = ({
  children,
  style,
  className,
  ...props
}: ComponentProps<typeof ContextMenuContent>) => (
  <ContextMenuContent style={{ ...menuSurfaceStyle, ...style }} className={className} {...props}>
    <EditorMenuInteractionStyles />
    {children}
  </ContextMenuContent>
);

/** 用途：子層 context menu 外殼，維持與主層相同 surface，並預設為直向表單排列。 */
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
      style={{ ...menuSurfaceStyle, display: "flex", flexDirection: "column", gap: 12, ...style }}
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

/** 用途：標示同一 menu 內的功能群組，例如「貼文外觀」「其他區塊」。 */
export const EditorMenuSectionLabel = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      padding: "4px 4px 0",
      fontSize: 12,
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

/** 用途：整排可點 trigger 的基底 style，交給 ColorPicker / BorderEditor 等控制器套用。 */
export const editorMenuTriggerStyle: CSSProperties = {
  width: "100%",
  minHeight: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "0 4px",
  border: "none",
  borderRadius: 6,
  background: "transparent",
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
    <span style={{ fontSize: 12, color: "#374151" }}>{label}</span>
    <span style={{ fontSize: 12, color: "#666" }}>{actionLabel}</span>
  </>
);
