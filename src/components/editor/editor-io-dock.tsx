"use client";

import { SaveProjectButton } from "@/components/editor/save-project-button";
import { CssImport } from "@/components/preview/common/css-import";
import { ExportButton } from "@/components/preview/common/export-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCSSImporter, useStyleManager } from "@/store/styleManager/styleManager";
import { useState } from "react";

type IoModal = "import" | "export" | "save" | "reset" | null;

const DOCK_CORAL = "#FF574D";
const LONGEST_DOCK_LABEL = "回復為初始模板";

type EditorIoDockProps = {
  onSkipDraftSave: () => void;
};

export const EditorIoDock = ({ onSkipDraftSave }: EditorIoDockProps) => {
  const { resetAllToInitial } = useCSSImporter();
  const hasExportableStyles = useStyleManager((s) => {
    let found = false;
    s.allStyles.forEach((props) => {
      props.forEach((entry) => {
        if (entry.source === "imported" || entry.source === "manual") found = true;
      });
    });
    return found;
  });

  const [touchOpen, setTouchOpen] = useState(false);
  const [modal, setModal] = useState<IoModal>(null);
  const [importResetToken, setImportResetToken] = useState(0);

  const isModalOpen = modal !== null;

  const openModal = (next: IoModal) => {
    setTouchOpen(false);
    setModal(next);
  };

  const handleResetConfirm = () => {
    onSkipDraftSave();
    resetAllToInitial();
    try {
      localStorage.removeItem("plurk-css-editor-draft");
      localStorage.removeItem("plurk-css-editor-imported-source");
    } catch {
      // ignore storage errors
    }
    setImportResetToken((n) => n + 1);
    setModal(null);
  };

  const dockClass = [
    "editor-io-dock",
    isModalOpen ? "is-modal-open" : "",
    touchOpen ? "is-touch-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <style>{`
        .editor-io-dock {
          position: fixed;
          right: 32px;
          bottom: 32px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: max-content;
        }
        .editor-io-dock-sizer {
          visibility: hidden;
          height: 0;
          overflow: hidden;
          padding: 8px 14px;
          border: 1px solid transparent;
          font-size: 13px;
          white-space: nowrap;
          box-sizing: border-box;
          pointer-events: none;
        }
        .editor-io-dock .editor-io-dock-menu {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 100%;
          padding-bottom: 8px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
          transform: translateY(12px);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            transform 220ms ease,
            opacity 220ms ease,
            visibility 0s linear 220ms;
        }
        .editor-io-dock:hover:not(.is-modal-open) .editor-io-dock-menu,
        .editor-io-dock.is-touch-open:not(.is-modal-open) .editor-io-dock-menu {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transition:
            transform 220ms ease,
            opacity 220ms ease,
            visibility 0s linear 0s;
        }
        .editor-io-dock-btn {
          width: 100%;
          box-sizing: border-box;
          background-color: #fff;
          color: ${DOCK_CORAL};
          border: 2px solid ${DOCK_CORAL};
          border-radius: 7px;
          padding: 8px 14px;
          cursor: pointer;
          font-size: 13px;
          white-space: nowrap;
          text-align: center;
        }
        .editor-io-dock > .editor-io-dock-btn {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }
        .editor-io-dock-btn:hover:not(:disabled),
        .editor-io-dock-btn:active:not(:disabled) {
          background-color: ${DOCK_CORAL};
          color: #fff;
        }
        .editor-io-dock-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          pointer-events: none;
        }
      `}</style>
      <div
        className={dockClass}
        onMouseLeave={() => setTouchOpen(false)}
      >
        <div className="editor-io-dock-sizer" aria-hidden>
          {LONGEST_DOCK_LABEL}
        </div>
        <div className="editor-io-dock-menu">
          <button type="button" className="editor-io-dock-btn" onClick={() => openModal("import")}>
            匯入 CSS
          </button>
          <button type="button" className="editor-io-dock-btn" onClick={() => openModal("reset")}>
            回復為初始模板
          </button>
          <button type="button" className="editor-io-dock-btn" onClick={() => openModal("export")}>
            匯出 CSS
          </button>
          <span title={hasExportableStyles ? undefined : "無改動"} style={{ display: "block", width: "100%" }}>
            <button
              type="button"
              className="editor-io-dock-btn"
              disabled={!hasExportableStyles}
              onClick={() => {
                if (!hasExportableStyles) return;
                openModal("save");
              }}
            >
              儲存專案
            </button>
          </span>
        </div>

        <button
          type="button"
          className="editor-io-dock-btn"
          onClick={() => {
            if (isModalOpen) return;
            setTouchOpen((prev) => !prev);
          }}
          title="輸入／輸出"
        >
          ✏️ 輸入／輸出
        </button>
      </div>

      <CssImport
        open={modal === "import"}
        onOpenChange={(open) => setModal(open ? "import" : null)}
        textareaResetToken={importResetToken}
      />
      <ExportButton
        open={modal === "export"}
        onOpenChange={(open) => setModal(open ? "export" : null)}
      />
      <SaveProjectButton
        open={modal === "save"}
        onOpenChange={(open) => setModal(open ? "save" : null)}
      />

      <Dialog open={modal === "reset"} onOpenChange={(open) => setModal(open ? "reset" : null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>回復</DialogTitle>
            <DialogDescription>
              將還原為初始模板，並清除已匯入的 CSS 與手動樣式。此操作無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              className="dialog-btn-secondary"
              onClick={() => setModal(null)}
            >
              取消
            </button>
            <button
              type="button"
              className="dialog-btn-danger"
              onClick={handleResetConfirm}
            >
              確認回復
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
