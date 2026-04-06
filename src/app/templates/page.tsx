"use client"

import { getOfficialTemplates, getTemplates } from "@/services/template.service";
import { StyleTemplateType } from "@/types/style-template.type";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TemplatesPage = () => {
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<StyleTemplateType[]>([]);
  const [officialTemplates, setOfficialTemplates] = useState<StyleTemplateType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadTemplates();
    loadOfficialTemplates();
  }, [selectedCategory]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = { visibility: 'PUBLIC' };
      if (selectedCategory !== 'all') {
        params.categoryId = selectedCategory;
      }

      const result = await getTemplates(params);
      setTemplates(result.templates);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const loadOfficialTemplates = async () => {
    try {
      const result = await getOfficialTemplates({ limit: 6 });
      setOfficialTemplates(result.templates);
    } catch (err) {
      console.error('Error loading official templates:', err);
    }
  };

  const openTemplateInEditor = (template: StyleTemplateType) => {
    try {
      const encodedCSS = encodeURIComponent(template.cssContent);
      const editorUrl = `/editor?import=${encodedCSS}`;
      window.open(editorUrl, '_blank');
    } catch (err) {
      console.error('Error opening template in editor:', err);
      alert('開啟模板失敗');
    }
  };

  const copyTemplateCSS = async (template: StyleTemplateType) => {
    try {
      await navigator.clipboard.writeText(template.cssContent);
      alert(`模板 "${template.name}" 的 CSS 已複製到剪貼簿！`);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = template.cssContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`模板 "${template.name}" 的 CSS 已複製到剪貼簿！`);
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
          onClick={loadTemplates}
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
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{ fontSize: '28px', color: '#333', margin: 0 }}>
            🎨 CSS 模板庫
          </h1>

          {session && (
            <Link href="/editor" style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              ➕ 創建模板
            </Link>
          )}
        </div>

        {/* Official Templates Section */}
        {officialTemplates.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '22px', color: '#333', margin: '0 0 16px 0' }}>
              ⭐ 官方精選模板
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {officialTemplates.map((template) => (
                <div key={template.id} style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: 'white'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    color: '#333',
                    margin: '0 0 8px 0',
                    fontWeight: '600'
                  }}>
                    {template.name}
                  </h3>

                  {template.description && (
                    <p style={{
                      color: '#666',
                      margin: '0 0 12px 0',
                      fontSize: '14px'
                    }}>
                      {template.description}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#888',
                    marginBottom: '12px'
                  }}>
                    <span>👍 {template.likeCount || 0}</span>
                    <span>🔀 {template.forkCount || 0}</span>
                    <span>👁️ {template.visibility}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openTemplateInEditor(template)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="在編輯器中開啟模板"
                    >
                      ✏️ 試用
                    </button>

                    <button
                      onClick={() => copyTemplateCSS(template)}
                      style={{
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="複製模板 CSS"
                    >
                      📋 複製
                    </button>

                    {session && (
                      <Link href={`/templates/${template.id}`} style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '12px'
                      }}>
                        🔀 Fork
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Templates Section */}
        <div>
          <h2 style={{ fontSize: '22px', color: '#333', margin: '0 0 16px 0' }}>
            📚 所有模板 ({templates.length})
          </h2>

          {templates.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              <p>還沒有任何模板</p>
              {session && (
                <p>成為第一個創建模板的人吧！</p>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {templates.map((template) => (
                <div key={template.id} style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: 'white'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    color: '#333',
                    margin: '0 0 8px 0',
                    fontWeight: '600'
                  }}>
                    {template.name}
                  </h3>

                  {template.description && (
                    <p style={{
                      color: '#666',
                      margin: '0 0 12px 0',
                      fontSize: '14px'
                    }}>
                      {template.description}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#888',
                    marginBottom: '12px'
                  }}>
                    <span>👍 {template.likeCount || 0}</span>
                    <span>🔀 {template.forkCount || 0}</span>
                    <span>👁️ {template.visibility}</span>
                    {template.isOfficial && <span>⭐ 官方</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openTemplateInEditor(template)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="在編輯器中開啟模板"
                    >
                      ✏️ 試用
                    </button>

                    <button
                      onClick={() => copyTemplateCSS(template)}
                      style={{
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="複製模板 CSS"
                    >
                      📋 複製
                    </button>

                    {session && (
                      <Link href={`/templates/${template.id}`} style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '12px'
                      }}>
                        🔀 Fork
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
            <li><strong>試用：</strong> 在編輯器中開啟模板，可以預覽和編輯樣式</li>
            <li><strong>複製：</strong> 將模板的 CSS 複製到剪貼簿</li>
            <li><strong>Fork：</strong> 登入後可以將模板複製為自己的專案</li>
            <li><strong>官方模板：</strong> 由團隊精心製作的精選模板</li>
            <li><strong>可見性：</strong> 公開（所有人可見）、未列出（可分享連結）、私人（僅作者可見）</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
