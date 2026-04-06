"use client";

import * as Popover from "@radix-ui/react-popover";
import { useEffect, useMemo, useState } from "react";

type ImageUploaderProps = {
  onUploadedUrl?: (url: string) => void;
  isLoggingIn: boolean;
};

type AssetItem = { id: string; url: string };

const ImageUploader = ({ onUploadedUrl, isLoggingIn }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<AssetItem[]>([]);
  const [externalUrl, setExternalUrl] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canSubmitExternalUrl = useMemo(() => {
    const v = externalUrl.trim();
    if (!v) return false;
    // 簡單檢查，避免亂填
    return /^https?:\/\/.+/i.test(v);
  }, [externalUrl]);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/assets", { method: "GET", cache: "no-store" });
      if (!response.ok) {
        throw new Error(`GET /api/assets failed (${response.status})`);
      }
      const data = await response.json().catch(() => null);
      const items = Array.isArray(data?.data) ? data.data : [];
      setImages(items.map((item: any) => ({
        id: String(item.id),
        url: String(item.url ?? ""),
      })));
    } catch (err) {
      console.warn("fetchImages failed:", err);
    }
  };


  useEffect(() => {
    // 只在 page load 觸發一次
    if (!isLoggingIn) return;
    fetchImages();
  }, [isLoggingIn]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_MB = 3;
    const MAX_BYTES = MAX_MB * 1024 * 1024;
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    // 可選：先清空，確保同檔可再選
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
          if (prev.some((x) => x.id === id)) return prev; // 防重複
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
  };

  const handleCancelExternalUrl = () => setExternalUrl("");

  const handlePickFromGallery = (url: string) => {
    onUploadedUrl?.(url);
  };

  const handleDelete = async (assetId: string) => {
    if (deletingId) return;

    setError(null);
    setDeletingId(assetId);

    // ✅ optimistic: 先從 UI 移除
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
          `Delete failed (status ${res.status})`
        );
      }
    } catch (err) {
      // ❌ rollback：直接 refresh（最穩）
      await fetchImages().catch(() => { });
      setError(err instanceof Error ? err.message : "Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  };




  return (
    <Popover.Root>
      <Popover.Trigger asChild>
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
          }}
        >
          Set Background
        </button>
      </Popover.Trigger>

      <Popover.Content
        side="right"
        align="start"
        sideOffset={10}
        style={{
          width: 360,
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          zIndex: 1400,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
              Background
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
              Upload, paste a URL, or pick from gallery
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchImages()}
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
            title={isLoggingIn ? "Refresh gallery" : "Login to refresh gallery"}
          >
            Refresh
          </button>
        </div>

        <div style={{ padding: 14, display: "grid", gap: 12 }}>
          {/* External URL */}
          <section
            style={{
              border: "1px solid #eef2f7",
              borderRadius: 12,
              padding: 12,
              background: "#fafafa",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>
              外部連結 URL
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              貼上圖片網址
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                type="text"
                placeholder="https://..."
                style={{
                  flex: 1,
                  fontSize: 12,
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: "8px 10px",
                  outline: "none",
                  background: "#fff",
                }}
              />
              <button
                type="button"
                onClick={handleConfirmExternalUrl}
                disabled={!canSubmitExternalUrl}
                style={{
                  fontSize: 12,
                  borderRadius: 10,
                  padding: "8px 10px",
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
                  fontSize: 12,
                  borderRadius: 10,
                  padding: "8px 10px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  color: "#374151",
                }}
              >
                取消
              </button>
            </div>

            {!canSubmitExternalUrl && externalUrl.trim() && (
              <div style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>
                請輸入有效的 http/https 連結
              </div>
            )}
          </section>

          {/* Upload / Gallery */}
          {!isLoggingIn ? (
            <div
              style={{
                border: "1px dashed #e5e7eb",
                borderRadius: 12,
                padding: 14,
                background: "#fff",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>
                請先登入以上傳圖片
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                登入後會顯示你的圖庫，並可直接點選套用背景
              </div>
            </div>
          ) : (
            <section
              style={{
                border: "1px solid #eef2f7",
                borderRadius: 12,
                padding: 12,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>
                  上傳與圖庫
                </div>
                {isUploading && (
                  <div style={{ fontSize: 12, color: "#6b7280" }}>上傳中…</div>
                )}
              </div>

              <div style={{ marginTop: 10 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  style={{
                    width: "100%",
                    fontSize: 12,
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: 8,
                    background: isUploading ? "#f9fafb" : "#fff",
                  }}
                />
              </div>

              {error && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#ef4444" }}>
                  錯誤：{error}
                </div>
              )}

              <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>
                  我的圖庫
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {images.filter((i) => i.url).length}
                </div>
              </div>

              <div
                style={{
                  marginTop: 10,
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
                        onClick={() => onUploadedUrl?.(img.url)}
                        style={{ display: "block", width: "100%", padding: 0, border: 0, background: "transparent" }}
                        title="Click to apply"
                      >
                        <img
                          src={img.url}
                          alt="Image"
                          style={{ width: "100%", height: 84, objectFit: "cover", display: "block" }}
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

                {images.filter((i) => i.url).length === 0 && (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      border: "1px dashed #e5e7eb",
                      borderRadius: 12,
                      padding: 12,
                      fontSize: 12,
                      color: "#6b7280",
                      background: "#fafafa",
                      textAlign: "center",
                    }}
                  >
                    目前沒有圖片，先上傳一張吧
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #f1f5f9",
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
          }}
        >
          <button
            type="button"
            onClick={() => void 0}
            style={{
              fontSize: 12,
              color: "#374151",
              border: "1px solid #e5e7eb",
              padding: "6px 10px",
              borderRadius: 10,
              background: "#fff",
            }}
          >
            重置為無
          </button>

          <Popover.Close asChild>
            <button
              type="button"
              style={{
                fontSize: 12,
                color: "#6b7280",
                border: "1px solid transparent",
                padding: "6px 10px",
                borderRadius: 10,
                background: "transparent",
              }}
            >
              Close
            </button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ImageUploader;
