"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

export type ImageUploaderProps = {
  onUploadedUrl?: (url: string) => void;
  /** 將背景重設為無（例如 `none`） */
  onResetBackground?: () => void;
  isLoggingIn: boolean;
  /** 受控：對話框是否開啟 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * 是否顯示內建「Set Background」按鈕。
   * false 時由外部以受控 `open` 開啟（例如右鍵選單）。
   */
  showTrigger?: boolean;
};

type AssetItem = { id: string; url: string };
type AssetsResponse = {
  data?: Array<{ id?: string | number; url?: string }>;
};

const sectionShell: CSSProperties = {
  border: "1px solid #eef2f7",
  borderRadius: 12,
  padding: 14,
  background: "#fafafa",
};

const ImageUploader = ({
  onUploadedUrl,
  onResetBackground,
  isLoggingIn,
  open: openProp,
  onOpenChange,
  showTrigger = true,
}: ImageUploaderProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (openProp === undefined) setInternalOpen(next);
  };

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<AssetItem[]>([]);
  const [publicImages, setPublicImages] = useState<AssetItem[]>([]);
  const [publicLoading, setPublicLoading] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [libraryTab, setLibraryTab] = useState<"public" | "personal">("public");

  const canSubmitExternalUrl = useMemo(() => {
    const v = externalUrl.trim();
    if (!v) return false;
    return /^https?:\/\/.+/i.test(v);
  }, [externalUrl]);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/assets", { method: "GET", cache: "no-store" });
      if (!response.ok) {
        throw new Error(`GET /api/assets failed (${response.status})`);
      }
      const data: AssetsResponse | null = await response.json().catch(() => null);
      const items = Array.isArray(data?.data) ? data.data : [];
      setImages(
        items.map((item) => ({
          id: String(item.id),
          url: String(item.url ?? ""),
        })),
      );
    } catch (err) {
      console.warn("fetchImages failed:", err);
    }
  };

  const fetchPublicImages = async () => {
    setPublicLoading(true);
    try {
      const response = await fetch("/api/assets/public", { method: "GET", cache: "no-store" });
      if (!response.ok) {
        throw new Error(`GET /api/assets/public failed (${response.status})`);
      }
      const data: AssetsResponse | null = await response.json().catch(() => null);
      const items = Array.isArray(data?.data) ? data.data : [];
      setPublicImages(
        items.map((item) => ({
          id: String(item.id),
          url: String(item.url ?? ""),
        })),
      );
    } catch (err) {
      console.warn("fetchPublicImages failed:", err);
      setPublicImages([]);
    } finally {
      setPublicLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggingIn) return;
    fetchImages();
  }, [isLoggingIn]);

  useEffect(() => {
    if (!open || libraryTab !== "public") return;
    void fetchPublicImages();
  }, [open, libraryTab]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_MB = 3;
    const MAX_BYTES = MAX_MB * 1024 * 1024;
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    input.value = "";

    if (file.size > MAX_BYTES) {
      setError(`File size exceeds the maximum allowed (${MAX_MB}MB)`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/assets", { method: "POST", body: formData });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const msg =
          (typeof data?.error === "string" && data.error) ||
          `Failed to upload image (status ${response.status})`;
        throw new Error(msg);
      }

      const url = String(data?.data?.url ?? data?.url ?? "");
      const id = String(data?.data?.id ?? "");

      if (!url) throw new Error("Upload succeeded but no URL returned");

      onUploadedUrl?.(url);

      if (id) {
        setImages((prev) => {
          if (prev.some((x) => x.id === id)) return prev;
          return [{ id, url }, ...prev];
        });
      } else {
        await fetchImages().catch((refreshErr) => {
          console.warn("Gallery refresh failed (upload likely ok):", refreshErr);
        });
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmExternalUrl = () => {
    if (!canSubmitExternalUrl) return;
    onUploadedUrl?.(externalUrl.trim());
    setExternalUrl("");
    setError(null);
    setOpen(false);
  };

  const handleCancelExternalUrl = () => setExternalUrl("");

  const handleDelete = async (assetId: string) => {
    if (deletingId) return;

    setError(null);
    setDeletingId(assetId);

    setImages((prev) => prev.filter((img) => img.id !== assetId));

    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "DELETE",
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          (typeof data?.error === "string" && data.error) ||
          `Delete failed (status ${res.status})`,
        );
      }
    } catch (err) {
      await fetchImages().catch(() => { });
      setError(err instanceof Error ? err.message : "Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleReset = () => {
    onResetBackground?.();
    setExternalUrl("");
    setError(null);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {showTrigger ? (
        <Dialog.Trigger asChild>
          <button
            type="button"
            style={{
              fontSize: 12,
              color: "#666",
              border: "1px solid #e5e7eb",
              background: "#fff",
              padding: "6px 10px",
              borderRadius: 8,
              lineHeight: "16px",
              cursor: "pointer",
            }}
          >
            Set Background
          </button>
        </Dialog.Trigger>
      ) : null}

      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          }}
        />
        <Dialog.Content
          aria-describedby={undefined}
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1500,
            width: "min(720px, calc(100vw - 32px))",
            maxHeight: "min(85vh, 880px)",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            borderRadius: 16,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div>
              <Dialog.Title style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
                Background
              </Dialog.Title>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "6px 0 0", lineHeight: 1.45 }}>
                外連 URL（免登入）；下方可切換公開／個人圖庫（個人含上傳，需登入）
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={() => void fetchImages()}
                disabled={!isLoggingIn}
                style={{
                  fontSize: 12,
                  color: isLoggingIn ? "#374151" : "#9ca3af",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  padding: "6px 10px",
                  borderRadius: 8,
                  cursor: isLoggingIn ? "pointer" : "not-allowed",
                }}
                title={isLoggingIn ? "重新整理個人圖庫" : "登入後可重新整理"}
              >
                Refresh
              </button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="關閉"
                  style={{
                    fontSize: 18,
                    lineHeight: 1,
                    width: 32,
                    height: 32,
                    border: "none",
                    background: "#f3f4f6",
                    borderRadius: 8,
                    cursor: "pointer",
                    color: "#6b7280",
                  }}
                >
                  ×
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div
            style={{
              padding: "16px 18px",
              display: "grid",
              gap: 14,
              overflowY: "auto",
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* 1. 外連 URL — 優先、免登入 */}
            <section style={{ ...sectionShell, background: "#f8fafc" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>外連 URL</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                貼上 http(s) 圖片網址，不需登入
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                <input
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  type="text"
                  placeholder="https://..."
                  style={{
                    flex: "1 1 200px",
                    fontSize: 13,
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "10px 12px",
                    outline: "none",
                    background: "#fff",
                  }}
                />
                <button
                  type="button"
                  onClick={handleConfirmExternalUrl}
                  disabled={!canSubmitExternalUrl}
                  style={{
                    fontSize: 13,
                    borderRadius: 10,
                    padding: "10px 14px",
                    border: "1px solid #e5e7eb",
                    background: canSubmitExternalUrl ? "#111827" : "#f3f4f6",
                    color: canSubmitExternalUrl ? "#fff" : "#9ca3af",
                    cursor: canSubmitExternalUrl ? "pointer" : "not-allowed",
                  }}
                >
                  確認
                </button>
                <button
                  type="button"
                  onClick={handleCancelExternalUrl}
                  style={{
                    fontSize: 13,
                    borderRadius: 10,
                    padding: "10px 14px",
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  清除
                </button>
              </div>

              {!canSubmitExternalUrl && externalUrl.trim() ? (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>
                  請輸入有效的 http/https 連結
                </div>
              ) : null}
            </section>

            {/* 圖庫：左公開／右個人切換，下方一大塊內容；上傳僅在個人分頁底部 */}
            <section
              style={{
                border: "1px solid #eef2f7",
                borderRadius: 12,
                padding: 0,
                background: "#fff",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 320,
              }}
            >
              <div
                role="tablist"
                aria-label="圖庫類型"
                style={{
                  display: "flex",
                  borderBottom: "1px solid #e5e7eb",
                  background: "#f8fafc",
                }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={libraryTab === "public"}
                  onClick={() => setLibraryTab("public")}
                  style={{
                    flex: 1,
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    borderBottom:
                      libraryTab === "public" ? "2px solid #111827" : "2px solid transparent",
                    marginBottom: -1,
                    background: libraryTab === "public" ? "#fff" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>公開圖庫</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    預設素材庫，不需登入
                  </div>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={libraryTab === "personal"}
                  onClick={() => setLibraryTab("personal")}
                  style={{
                    flex: 1,
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    borderLeft: "1px solid #e5e7eb",
                    borderBottom:
                      libraryTab === "personal" ? "2px solid #111827" : "2px solid transparent",
                    marginBottom: -1,
                    background: libraryTab === "personal" ? "#fff" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>個人圖庫</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    登入後顯示已上傳圖片
                  </div>
                </button>
              </div>

              <div
                role="tabpanel"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                  padding: 14,
                }}
              >
                {libraryTab === "public" ? (
                  <div style={{ flex: 1, minHeight: 220, display: "flex", flexDirection: "column", gap: 10 }}>
                    {publicLoading ? (
                      <div
                        style={{
                          flex: 1,
                          minHeight: 180,
                          display: "grid",
                          placeItems: "center",
                          fontSize: 13,
                          color: "#94a3b8",
                        }}
                      >
                        載入中…
                      </div>
                    ) : publicImages.filter((img) => img.url).length === 0 ? (
                      <div
                        style={{
                          flex: 1,
                          minHeight: 180,
                          border: "1px dashed #cbd5e1",
                          borderRadius: 12,
                          display: "grid",
                          placeItems: "center",
                          fontSize: 13,
                          color: "#94a3b8",
                          background: "#fafafa",
                          textAlign: "center",
                          padding: 16,
                        }}
                      >
                        尚無公開素材。請在後台將圖檔上傳至{" "}
                        <code style={{ fontSize: 11 }}>public-gallery/</code> 後重新開啟此視窗。
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: 8,
                          maxHeight: 280,
                          overflow: "auto",
                        }}
                      >
                        {publicImages
                          .filter((img) => img.url)
                          .map((img) => (
                            <div
                              key={img.id}
                              style={{
                                position: "relative",
                                border: "1px solid #e5e7eb",
                                borderRadius: 10,
                                overflow: "hidden",
                                background: "#fff",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  onUploadedUrl?.(img.url);
                                  setOpen(false);
                                }}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  padding: 0,
                                  border: 0,
                                  background: "transparent",
                                  cursor: "pointer",
                                }}
                                title="套用為背景"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.url}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: 88,
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 0,
                      gap: 0,
                    }}
                  >
                    <div style={{ flex: 1, overflow: "auto", minHeight: 120 }}>
                      {!isLoggingIn ? (
                        <div
                          style={{
                            minHeight: 200,
                            padding: 20,
                            borderRadius: 12,
                            background: "#fffbeb",
                            border: "1px solid #fde68a",
                            fontSize: 13,
                            color: "#92400e",
                            display: "grid",
                            placeItems: "center",
                            textAlign: "center",
                          }}
                        >
                          請先登入以使用個人圖庫與上傳
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 8,
                          }}
                        >
                          {images
                            .filter((img) => img.url)
                            .map((img) => (
                              <div
                                key={img.id}
                                style={{
                                  position: "relative",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: 10,
                                  overflow: "hidden",
                                  background: "#fff",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUploadedUrl?.(img.url);
                                    setOpen(false);
                                  }}
                                  style={{
                                    display: "block",
                                    width: "100%",
                                    padding: 0,
                                    border: 0,
                                    background: "transparent",
                                    cursor: "pointer",
                                  }}
                                  title="套用為背景"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={img.url}
                                    alt=""
                                    style={{
                                      width: "100%",
                                      height: 88,
                                      objectFit: "cover",
                                      display: "block",
                                    }}
                                  />
                                </button>

                                <button
                                  type="button"
                                  disabled={deletingId === img.id}
                                  onClick={() => handleDelete(img.id)}
                                  style={{
                                    position: "absolute",
                                    top: 6,
                                    right: 6,
                                    width: 26,
                                    height: 26,
                                    borderRadius: 999,
                                    border: "1px solid rgba(255,255,255,0.7)",
                                    background: "rgba(0,0,0,0.55)",
                                    color: "#fff",
                                    cursor: deletingId === img.id ? "not-allowed" : "pointer",
                                    display: "grid",
                                    placeItems: "center",
                                    fontSize: 14,
                                    lineHeight: "14px",
                                    opacity: deletingId === img.id ? 0.6 : 1,
                                  }}
                                  title={deletingId === img.id ? "Deleting..." : "Delete"}
                                >
                                  {deletingId === img.id ? "…" : "×"}
                                </button>
                              </div>
                            ))}

                          {images.filter((i) => i.url).length === 0 ? (
                            <div
                              style={{
                                gridColumn: "1 / -1",
                                border: "1px dashed #e5e7eb",
                                borderRadius: 12,
                                padding: 24,
                                fontSize: 13,
                                color: "#6b7280",
                                background: "#fafafa",
                                textAlign: "center",
                              }}
                            >
                              尚無圖片，請使用下方上傳
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {isLoggingIn ? (
                      <div
                        style={{
                          flexShrink: 0,
                          marginTop: 12,
                          paddingTop: 12,
                          borderTop: "1px solid #f1f5f9",
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                          上傳圖片
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>
                          上傳至雲端後會出現於上方圖庫
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={isUploading}
                          style={{
                            width: "100%",
                            fontSize: 13,
                            border: "1px solid #e5e7eb",
                            borderRadius: 10,
                            padding: 10,
                            background: isUploading ? "#f9fafb" : "#fff",
                          }}
                        />
                        {isUploading ? (
                          <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>上傳中…</div>
                        ) : null}
                        {error ? (
                          <div style={{ marginTop: 10, fontSize: 12, color: "#ef4444" }}>
                            錯誤：{error}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid #f1f5f9",
              padding: "12px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
              background: "#fafafa",
            }}
          >
            <button
              type="button"
              onClick={handleReset}
              style={{
                fontSize: 13,
                color: "#374151",
                border: "1px solid #e5e7eb",
                padding: "8px 14px",
                borderRadius: 10,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              重置為無
            </button>

            <Dialog.Close asChild>
              <button
                type="button"
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  border: "1px solid #e5e7eb",
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImageUploader;
