"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export const DOCK_CORAL = "#FF574D"

/** 用途：編輯器共用 dialog 外觀與按鈕樣式，讓匯入／匯出／儲存／回復同一套珊瑚紅 UI。 */
function DialogStyles() {
  return (
    <style>{`
      :root {
        --dialog-coral: ${DOCK_CORAL};
        --dialog-coral-hover: #e84e44;
        --dialog-coral-strong: #e23d34;
        --dialog-coral-muted: rgba(255, 87, 77, 0.08);
        --dialog-border: #e5e7eb;
        --dialog-border-strong: #d1d5db;
        --dialog-text-muted: #6b7280;
      }

      [data-slot="dialog-content"] {
        display: flex;
        flex-direction: column;
        max-height: 90vh;
        overflow: hidden;
        padding: 32px;
        border-radius: 20px;
        background: #fff;
        color: #111827;
        font-size: 14px;
        line-height: 1.5;
        font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.14), 0 4px 16px rgba(0, 0, 0, 0.06);
      }

      [data-slot="dialog-header"],
      [data-slot="dialog-footer"] {
        flex-shrink: 0;
      }

      [data-slot="dialog-body"] {
        min-height: 0;
        overflow: auto;
      }

      [data-slot="dialog-footer"] {
        width: 100%;
      }

      .dialog-body {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .dialog-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 8px;
      }

      .dialog-input,
      .dialog-textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--dialog-border);
        border-radius: 8px;
        font-size: 14px;
        color: #111827;
        background: #fff;
        transition: border-color 150ms ease, box-shadow 150ms ease;
        box-sizing: border-box;
      }

      .dialog-input:focus,
      .dialog-textarea:focus {
        outline: none;
        border-color: var(--dialog-coral);
        box-shadow: 0 0 0 3px rgba(255, 87, 77, 0.15);
      }

      .dialog-textarea-mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 12px;
        resize: vertical;
        line-height: 1.5;
      }

      .dialog-hint {
        margin: 0;
        font-size: 12px;
        color: var(--dialog-text-muted);
        line-height: 1.5;
      }

      .dialog-info-box {
        background-color: #f9fafb;
        padding: 14px 16px;
        border-radius: 10px;
        font-size: 12px;
        color: var(--dialog-text-muted);
        border: 1px solid #f3f4f6;
        line-height: 1.5;
      }

      .dialog-info-box p {
        margin: 0 0 8px 0;
      }

      .dialog-info-box ul {
        margin: 0;
        padding-left: 20px;
      }

      .dialog-preview {
        background-color: #f9fafb;
        padding: 12px;
        border-radius: 8px;
        font-size: 11px;
        max-height: 150px;
        overflow: auto;
        border: 1px solid var(--dialog-border);
        margin: 0;
        line-height: 1.5;
      }

      .dialog-ignored-list {
        margin: 0;
        padding-left: 20px;
        font-size: 12px;
        color: var(--dialog-text-muted);
        line-height: 1.6;
      }

      .dialog-ignored-list li + li {
        margin-top: 4px;
      }

      .dialog-btn-primary {
        padding: 10px 20px;
        background-color: var(--dialog-coral);
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 150ms ease;
      }

      .dialog-btn-primary:hover:not(:disabled) {
        background-color: var(--dialog-coral-hover);
      }

      .dialog-btn-primary:disabled {
        background-color: #d1d5db;
        cursor: not-allowed;
      }

      .dialog-btn-secondary {
        padding: 10px 20px;
        background-color: #fff;
        color: #374151;
        border: 1px solid var(--dialog-border-strong);
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 150ms ease, border-color 150ms ease;
      }

      .dialog-btn-secondary:hover:not(:disabled) {
        background-color: #f9fafb;
        border-color: #9ca3af;
      }

      .dialog-btn-secondary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .dialog-btn-outline {
        padding: 10px 20px;
        background-color: #fff;
        color: var(--dialog-coral);
        border: 1px solid var(--dialog-coral);
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 150ms ease;
      }

      .dialog-btn-outline:hover:not(:disabled) {
        background-color: var(--dialog-coral-muted);
      }

      .dialog-footer {
        display: flex;
        gap: 12px;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        padding-top: 20px;
        border-top: 1px solid var(--dialog-border-strong);
      }

      .dialog-footer:has(> :only-child) {
        justify-content: flex-end;
      }

      .dialog-footer .dialog-btn-primary,
      .dialog-footer .dialog-btn-secondary,
      .dialog-footer .dialog-btn-danger {
        min-width: 100px;
      }

      .dialog-btn-danger {
        padding: 10px 20px;
        background-color: var(--dialog-coral-strong);
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 150ms ease;
      }

      .dialog-btn-danger:hover:not(:disabled) {
        background-color: #c9342c;
      }

      .dialog-actions-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .dialog-actions-row .dialog-btn-primary,
      .dialog-actions-row .dialog-btn-secondary {
        flex: 1;
        min-width: 120px;
      }

      .dialog-section-divider {
        border-top: 1px solid var(--dialog-border);
        padding-top: 16px;
      }

      .dialog-option-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .dialog-option-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border: 1.5px solid var(--dialog-border);
        border-radius: 10px;
        cursor: pointer;
        transition: border-color 150ms ease, background-color 150ms ease;
        font-size: 14px;
        color: #374151;
        user-select: none;
      }

      .dialog-option-card:hover {
        border-color: #d1d5db;
        background-color: #fafafa;
      }

      .dialog-option-card.is-selected,
      .dialog-option-card.is-selected:hover {
        border: 1.5px solid var(--dialog-coral);
        background-color: var(--dialog-coral-muted);
      }

      .dialog-option-card.is-disabled {
        opacity: 0.55;
        cursor: not-allowed;
        pointer-events: none;
      }

      .dialog-option-card input[type="radio"],
      .dialog-option-card input[type="checkbox"] {
        accent-color: var(--dialog-coral);
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        margin: 0;
      }

      .dialog-checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 13px;
        color: #374151;
      }

      .dialog-checkbox-row input[type="checkbox"] {
        accent-color: var(--dialog-coral);
        width: 16px;
        height: 16px;
        margin: 0;
      }

      .dialog-option-inline-group {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .dialog-option-inline-group .dialog-option-card {
        flex: 1;
        min-width: fit-content;
        justify-content: center;
        padding: 10px 12px;
      }

      .dialog-option-note {
        font-size: 11px;
        color: #9ca3af;
      }
    `}</style>
  )
}

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-[20000] bg-black/45", className)}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogStyles />
      <DialogOverlay />
      {/* 用途：只允許 × 或 Esc 關閉，避免點 overlay 誤關正在編輯的匯入／匯出內容。 */}
      <DialogPrimitive.Content
        data-slot="dialog-content"
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className={cn(
          "fixed top-1/2 left-1/2 z-[20001] flex max-h-[90vh] w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[20px] border-0 bg-white p-8 font-sans shadow-[0_24px_64px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.06)] outline-hidden",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute top-5 right-5 rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus:outline-hidden"
          aria-label="關閉"
        >
          <XIcon className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("mb-6 pr-10", className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-2xl font-bold tracking-tight text-neutral-900", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("mt-1.5 text-sm leading-relaxed text-neutral-500", className)}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("dialog-body min-h-0 overflow-auto", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("dialog-footer", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
}
