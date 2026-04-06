"use client"

import { deleteProject, getUserProjects } from "@/services/project.service";
import { Project } from "@/types/project.type";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardProjectsPage = () => {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | 'PRIVATE' | 'UNLISTED' | 'PUBLIC'>('ALL');

  useEffect(() => {
    if (status === 'authenticated') {
      loadProjects();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, visibilityFilter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {};
      if (visibilityFilter !== 'ALL') {
        params.visibility = visibilityFilter;
      }

      const result = await getUserProjects(params);
      setProjects(result.projects);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('確定要刪除這個專案嗎？此操作無法復原。')) {
      return;
    }

    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      alert('專案已刪除');
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('刪除專案失敗，請重試');
    }
  };

  const copyProjectCSS = async (project: Project) => {
    try {
      await navigator.clipboard.writeText(project.cssContent);
      alert(`專案 "${project.name}" 的 CSS 已複製到剪貼簿！`);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = project.cssContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`專案 "${project.name}" 的 CSS 已複製到剪貼簿！`);
    }
  };

  const openProjectInEditor = (project: Project) => {
    try {
      const encodedCSS = encodeURIComponent(project.cssContent);
      const editorUrl = `/editor?import=${encodedCSS}`;
      window.open(editorUrl, '_blank');
    } catch (err) {
      console.error('Error opening project in editor:', err);
      alert('開啟專案失敗');
    }
  };

  // 如果未登入，顯示登入提示
  if (status === 'unauthenticated') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: '20px'
      }}>
        <h1 style={{ fontSize: '24px', color: '#333', margin: 0 }}>
          🔐 需要登入
        </h1>

        <div style={{
          textAlign: 'center',
          color: '#666',
          maxWidth: '400px'
        }}>
          <p>請先登入以管理你的專案</p>
        </div>

        <Link href="/auth/signin" style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          🔑 登入
        </Link>
      </div>
    );
  }

  // 如果正在載入
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        載入中...
      </div>
    );
  }

  // 如果有錯誤
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: '20px'
      }}>
        <h1 style={{ fontSize: '24px', color: '#dc3545', margin: 0 }}>
          ❌ 載入失敗
        </h1>

        <div style={{
          textAlign: 'center',
          color: '#666',
          maxWidth: '400px'
        }}>
          <p>{error}</p>
        </div>

        <button
          onClick={loadProjects}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          🔄 重試
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{ fontSize: '28px', color: '#333', margin: 0 }}>
            📁 我的專案 ({projects.length})
          </h1>

          <Link href="/editor" style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            ➕ 新建專案
          </Link>
        </div>

        {/* Visibility Filter */}
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
              可見性篩選:
            </span>

            {(['ALL', 'PRIVATE', 'UNLISTED', 'PUBLIC'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setVisibilityFilter(filter)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: visibilityFilter === filter ? '#007bff' : 'white',
                  color: visibilityFilter === filter ? 'white' : '#333',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {filter === 'ALL' && '全部'}
                {filter === 'PRIVATE' && '私人'}
                {filter === 'UNLISTED' && '未列出'}
                {filter === 'PUBLIC' && '公開'}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <p>還沒有儲存任何專案</p>
            <p>前往編輯器創建你的第一個 CSS 專案吧！</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {projects.map((project) => (
              <div key={project.id} style={{
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: 'white'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '18px',
                      color: '#333',
                      margin: '0 0 8px 0',
                      fontWeight: '600'
                    }}>
                      {project.name}
                    </h3>

                    {project.description && (
                      <p style={{
                        color: '#666',
                        margin: '0 0 12px 0',
                        fontSize: '14px'
                      }}>
                        {project.description}
                      </p>
                    )}

                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '12px',
                      color: '#888'
                    }}>
                      <span>📅 創建: {new Date(project.createdAt).toLocaleDateString()}</span>
                      <span>🔄 更新: {new Date(project.updatedAt).toLocaleDateString()}</span>
                      <span>👁️ {project.visibility}</span>
                      <span>📝 CSS 規則: {(project.cssContent.match(/\}/g) || []).length}</span>
                      <span>🔗 Slug: {project.slug}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openProjectInEditor(project)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="在編輯器中開啟專案"
                    >
                      ✏️ 編輯
                    </button>

                    <button
                      onClick={() => copyProjectCSS(project)}
                      style={{
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="複製專案 CSS"
                    >
                      📋 複製 CSS
                    </button>

                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="刪除專案"
                    >
                      🗑️ 刪除
                    </button>
                  </div>
                </div>

                {/* CSS 預覽 */}
                <details style={{ marginTop: '16px' }}>
                  <summary style={{
                    cursor: 'pointer',
                    color: '#007bff',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    👁️ 預覽 CSS 內容
                  </summary>
                  <pre style={{
                    backgroundColor: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    overflow: 'auto',
                    maxHeight: '200px',
                    marginTop: '8px',
                    border: '1px solid #e9ecef'
                  }}>
                    {project.cssContent}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#666'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>💡 使用說明</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>編輯：</strong> 在編輯器中開啟專案，可以繼續編輯樣式</li>
            <li><strong>複製 CSS：</strong> 將專案的 CSS 複製到剪貼簿</li>
            <li><strong>刪除：</strong> 永久刪除專案（無法復原）</li>
            <li><strong>可見性：</strong> 私人（僅自己可見）、未列出（可分享連結）、公開（所有人可見）</li>
            <li><strong>專案儲存：</strong> 所有專案都儲存在資料庫中，安全可靠</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardProjectsPage;
