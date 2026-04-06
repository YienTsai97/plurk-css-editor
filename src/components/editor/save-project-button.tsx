"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createProject } from "@/services/project.service";
import { useCSSImporter } from "@/store/styleManager/styleManager";
import { useSession } from "next-auth/react";
import { useState } from "react";

type SaveProjectButtonProps = {
  layout?: "fixed" | "inline";
};

export const SaveProjectButton = ({ layout = "fixed" }: SaveProjectButtonProps) => {
  const { data: session } = useSession();
  const { getAllStyles } = useCSSImporter();
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [visibility, setVisibility] = useState<'PRIVATE' | 'UNLISTED' | 'PUBLIC'>('PRIVATE');
  const [storageType, setStorageType] = useState<'local' | 'database'>('local');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!projectName.trim()) {
      alert('請輸入專案名稱');
      return;
    }

    setIsSaving(true);

    try {
      const { css, tags } = getAllStyles();

      // 檢查是否有樣式內容
      if (!css.trim()) {
        alert('沒有樣式內容可以儲存');
        return;
      }

      if (storageType === 'database') {
        // 儲存到資料庫
        if (!session?.user?.id) {
          alert('請先登入以儲存到資料庫');
          return;
        }

        const projectData = {
          name: projectName.trim(),
          description: projectDescription.trim() || null,
          cssContent: css,
          visibility,
          userId: session.user.id
        };

        await createProject(projectData);
        alert(`專案 "${projectName}" 已儲存到資料庫！`);
      } else {
        // 儲存到 localStorage
        const projectData = {
          name: projectName.trim(),
          description: projectDescription.trim() || undefined,
          cssContent: css,
          visibility,
          slug: generateSlug(projectName),
          createdAt: new Date().toISOString()
        };

        const savedProjects = JSON.parse(localStorage.getItem('plurk-css-editor-projects') || '[]');
        const newProject = {
          id: `project_${Date.now()}`,
          ...projectData,
          updatedAt: new Date().toISOString()
        };

        savedProjects.push(newProject);
        localStorage.setItem('plurk-css-editor-projects', JSON.stringify(savedProjects));
        alert(`專案 "${projectName}" 已儲存到本地！`);
      }

      // 清除草稿
      localStorage.removeItem('plurk-css-editor-draft');

      // 重置表單
      setProjectName("");
      setProjectDescription("");
      setVisibility('PRIVATE');
      setIsOpen(false);

    } catch (error) {
      console.error('儲存專案失敗:', error);
      alert(`儲存專案失敗：${error instanceof Error ? error.message : '請重試'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 生成 slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // 檢查是否有樣式內容
  const hasStyles = () => {
    try {
      const { css } = getAllStyles();
      return css.trim().length > 0;
    } catch {
      return false;
    }
  };

  if (!hasStyles()) {
    return null; // 沒有樣式時不顯示按鈕
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          style={{
            position: layout === "inline" ? "static" : "fixed",
            bottom: layout === "inline" ? undefined : "20px",
            right: layout === "inline" ? undefined : "260px",
            backgroundColor: "#28a745",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
          title="將當前樣式儲存為專案"
        >
          💾 Save Project
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-4" style={{ zIndex: 1000 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            💾 儲存專案
          </h3>

          {/* 儲存類型選擇 */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              儲存位置
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="storageType"
                  value="local"
                  checked={storageType === 'local'}
                  onChange={(e) => setStorageType(e.target.value as 'local' | 'database')}
                />
                <span>💾 本地儲存</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="storageType"
                  value="database"
                  checked={storageType === 'database'}
                  onChange={(e) => setStorageType(e.target.value as 'local' | 'database')}
                  disabled={!session?.user?.id}
                />
                <span>🗄️ 資料庫</span>
                {!session?.user?.id && <span style={{ fontSize: '11px', color: '#999' }}>(需登入)</span>}
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              專案名稱 *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="輸入專案名稱..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              maxLength={100}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              專案描述
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="描述這個專案..."
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              maxLength={500}
            />
          </div>

          {/* 可見性選擇（僅資料庫儲存時顯示） */}
          {storageType === 'database' && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                可見性
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['PRIVATE', 'UNLISTED', 'PUBLIC'] as const).map((vis) => (
                  <label key={vis} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="visibility"
                      value={vis}
                      checked={visibility === vis}
                      onChange={(e) => setVisibility(e.target.value as any)}
                    />
                    <span>
                      {vis === 'PRIVATE' && '👁️ 私人'}
                      {vis === 'UNLISTED' && '🔗 未列出'}
                      {vis === 'PUBLIC' && '🌍 公開'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666'
          }}>
            <p style={{ margin: '0 0 8px 0' }}><strong>專案資訊：</strong></p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>樣式規則數量: {(() => {
                try {
                  const { css } = getAllStyles();
                  return (css.match(/\}/g) || []).length;
                } catch {
                  return 0;
                }
              })()}</li>
              <li>可見性: {visibility === 'PRIVATE' && '私人（僅自己可見）'}
                {visibility === 'UNLISTED' && '未列出（可分享連結）'}
                {visibility === 'PUBLIC' && '公開（所有人可見）'}</li>
              <li>儲存位置: {storageType === 'local' ? '本地儲存' : '資料庫'}
                {storageType === 'database' && !session?.user?.id && ' (需登入)'}</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSave}
              disabled={!projectName.trim() || isSaving || (storageType === 'database' && !session?.user?.id)}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: projectName.trim() && !isSaving && !(storageType === 'database' && !session?.user?.id) ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: projectName.trim() && !isSaving && !(storageType === 'database' && !session?.user?.id) ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {isSaving ? '儲存中...' : '儲存專案'}
            </button>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: '10px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              取消
            </button>
          </div>

          <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
            {storageType === 'local' ? (
              '💡 專案會儲存在本地，重新整理頁面後仍可存取'
            ) : (
              '💡 專案會儲存在資料庫中，安全可靠且可跨裝置存取'
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
