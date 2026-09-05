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
import { createProject } from "@/services/project.service";
import { useCSSImporter } from "@/store/styleManager/styleManager";
import { useSession } from "next-auth/react";
import { useState } from "react";

type SaveProjectButtonProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SaveProjectButton = ({ open, onOpenChange }: SaveProjectButtonProps) => {
  const { data: session } = useSession();
  const { getAllStyles } = useCSSImporter();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [visibility, setVisibility] = useState<"PRIVATE" | "UNLISTED" | "PUBLIC">("PRIVATE");
  const [storageType, setStorageType] = useState<"local" | "database">("local");
  const [isSaving, setIsSaving] = useState(false);
  const isLoggedIn = Boolean(session?.user?.id);

  const handleSave = async () => {
    if (!projectName.trim()) {
      alert("請輸入專案名稱");
      return;
    }

    setIsSaving(true);

    try {
      const { css } = getAllStyles();

      if (!css.trim()) {
        alert("沒有樣式內容可以儲存");
        return;
      }

      if (storageType === "database") {
        if (!session?.user?.id) {
          alert("請先登入以使用線上儲存");
          return;
        }

        const projectData = {
          name: projectName.trim(),
          description: projectDescription.trim() || null,
          cssContent: css,
          visibility,
          userId: session.user.id,
        };

        await createProject(projectData);
        alert(`專案「${projectName}」已儲存到線上！`);
      } else {
        const projectData = {
          name: projectName.trim(),
          description: projectDescription.trim() || undefined,
          cssContent: css,
          visibility,
          slug: generateSlug(projectName),
          createdAt: new Date().toISOString(),
        };

        const savedProjects = JSON.parse(localStorage.getItem("plurk-css-editor-projects") || "[]");
        const newProject = {
          id: `project_${Date.now()}`,
          ...projectData,
          updatedAt: new Date().toISOString(),
        };

        savedProjects.push(newProject);
        localStorage.setItem("plurk-css-editor-projects", JSON.stringify(savedProjects));
        alert(`專案「${projectName}」已儲存到本地！`);
      }

      localStorage.removeItem("plurk-css-editor-draft");

      setProjectName("");
      setProjectDescription("");
      setVisibility("PRIVATE");
      onOpenChange(false);
    } catch (error) {
      console.error("儲存專案失敗:", error);
      alert(`儲存專案失敗：${error instanceof Error ? error.message : "請重試"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const canSave =
    Boolean(projectName.trim()) && !isSaving && !(storageType === "database" && !isLoggedIn);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>儲存專案</DialogTitle>
          <DialogDescription>
            將目前樣式儲存為本地或線上專案。
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div>
            <span className="dialog-label">儲存位置</span>
            <div className="dialog-option-inline-group">
              <label className={`dialog-option-card${storageType === "local" ? " is-selected" : ""}`}>
                <input
                  type="radio"
                  name="storageType"
                  value="local"
                  checked={storageType === "local"}
                  onChange={() => setStorageType("local")}
                />
                <span>本地儲存</span>
              </label>
              <label
                className={`dialog-option-card${storageType === "database" ? " is-selected" : ""}${!isLoggedIn ? " is-disabled" : ""}`}
                title={isLoggedIn ? undefined : "需登入"}
              >
                <input
                  type="radio"
                  name="storageType"
                  value="database"
                  checked={storageType === "database"}
                  onChange={() => setStorageType("database")}
                  disabled={!isLoggedIn}
                />
                <span>線上儲存</span>
                {!isLoggedIn && <span className="dialog-option-note">需登入</span>}
              </label>
            </div>
          </div>

          <div>
            <label className="dialog-label" htmlFor="save-project-name">
              專案名稱 *
            </label>
            <input
              id="save-project-name"
              className="dialog-input"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="輸入專案名稱…"
              maxLength={100}
            />
          </div>

          <div>
            <label className="dialog-label" htmlFor="save-project-description">
              專案描述
            </label>
            <textarea
              id="save-project-description"
              className="dialog-textarea"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="描述這個專案…"
              rows={3}
              maxLength={500}
            />
          </div>

          {storageType === "database" && (
            <div>
              <span className="dialog-label">可見性</span>
              <div className="dialog-option-inline-group">
                {(["PRIVATE", "UNLISTED", "PUBLIC"] as const).map((vis) => (
                  <label
                    key={vis}
                    className={`dialog-option-card${visibility === vis ? " is-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={vis}
                      checked={visibility === vis}
                      onChange={(e) => setVisibility(e.target.value as "PRIVATE" | "UNLISTED" | "PUBLIC")}
                    />
                    <span>
                      {vis === "PRIVATE" && "私人"}
                      {vis === "UNLISTED" && "未列出"}
                      {vis === "PUBLIC" && "公開"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="dialog-info-box">
            <p><strong>專案資訊：</strong></p>
            <ul>
              <li>
                樣式規則數量: {(() => {
                  try {
                    const { css } = getAllStyles();
                    return (css.match(/\}/g) || []).length;
                  } catch {
                    return 0;
                  }
                })()}
              </li>
              <li>
                可見性: {visibility === "PRIVATE" && "私人（僅自己可見）"}
                {visibility === "UNLISTED" && "未列出（可分享連結）"}
                {visibility === "PUBLIC" && "公開（所有人可見）"}
              </li>
              <li>
                儲存位置: {storageType === "local" ? "本地儲存" : "線上儲存"}
                {storageType === "database" && !isLoggedIn && "（需登入）"}
              </li>
            </ul>
          </div>

          <p className="dialog-hint">
            {storageType === "local"
              ? "專案會儲存在本地，重新整理頁面後仍可存取"
              : "專案會儲存在線上，可跨裝置存取"}
          </p>
        </DialogBody>

        <DialogFooter>
          <button
            type="button"
            className="dialog-btn-secondary"
            onClick={() => onOpenChange(false)}
          >
            取消
          </button>
          <button
            type="button"
            className="dialog-btn-primary"
            onClick={handleSave}
            disabled={!canSave}
          >
            {isSaving ? "儲存中…" : "儲存專案"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
