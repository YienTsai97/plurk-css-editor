"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  description?: string;
  cssContent: string;
  visibility: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    try {
      const savedProjects = localStorage.getItem('plurk-css-editor-projects');
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = (projectId: string) => {
    if (confirm('確定要刪除這個專案嗎？此操作無法復原。')) {
      try {
        const updatedProjects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('plurk-css-editor-projects', JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        alert('專案已刪除');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('刪除專案失敗');
      }
    }
  };

  const copyProjectCSS = (project: Project) => {
    try {
      navigator.clipboard.writeText(project.cssContent).then(() => {
        alert(`專案 "${project.name}" 的 CSS 已複製到剪貼簿！`);
      }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = project.cssContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(`專案 "${project.name}" 的 CSS 已複製到剪貼簿！`);
      });
    } catch (error) {
      console.error('Error copying CSS:', error);
      alert('複製 CSS 失敗');
    }
  };

  const openProjectInEditor = (project: Project) => {
    try {
      const encodedCSS = encodeURIComponent(project.cssContent);
      const editorUrl = `/editor?import=${encodedCSS}`;
      window.open(editorUrl, '_blank');
    } catch (error) {
      console.error('Error opening project in editor:', error);
      alert('開啟專案失敗');
    }
  };

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

  if (projects.length === 0) {
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
          📁 我的專案
        </h1>

        <div style={{
          textAlign: 'center',
          color: '#666',
          maxWidth: '400px'
        }}>
          <p>還沒有儲存任何專案</p>
          <p>前往編輯器創建你的第一個 CSS 專案吧！</p>
        </div>

        <Link href="/editor" style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          🚀 開始編輯
        </Link>
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
                    onClick={() => deleteProject(project.id)}
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
            <li><strong>專案儲存：</strong> 所有專案都儲存在本地，重新整理頁面後仍可存取</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
