import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

/** 與 `src/app/api/assets/route.ts` 相同 bucket */
const BUCKET_NAME = "pcg-assets";
/**
 * 公開素材放在此 prefix 下（在 Supabase Dashboard 上傳，或 CLI sync）。
 * 勿與使用者上傳路徑 `${userId}/...` 混用。
 */
const PUBLIC_GALLERY_PREFIX = "public-gallery";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;

function isImageFile(name: string, mimeType?: string | null): boolean {
  if (mimeType && /^image\//i.test(mimeType)) return true;
  return IMAGE_EXT.test(name);
}

/**
 * GET — 列出公開圖庫（免登入）。
 * 依賴：bucket 已開 public 讀取，且檔案位於 `public-gallery/` 下。
 */
export async function GET() {
  try {
    const { data, error } = await supabaseServer.storage
      .from(BUCKET_NAME)
      .list(PUBLIC_GALLERY_PREFIX, {
        limit: 100,
        offset: 0,
        sortBy: { column: "updated_at", order: "desc" },
      });

    if (error) {
      console.error("[public assets] list error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to list public gallery" },
        { status: 500 },
      );
    }

    const rows: Array<{ id: string; url: string }> = [];

    for (const item of data ?? []) {
      if (!item?.name) continue;
      const mime = item.metadata?.mimetype as string | undefined;
      if (!isImageFile(item.name, mime)) continue;

      const key = `${PUBLIC_GALLERY_PREFIX}/${item.name}`;
      const { data: pub } = supabaseServer.storage.from(BUCKET_NAME).getPublicUrl(key);
      if (pub?.publicUrl) {
        rows.push({ id: key, url: pub.publicUrl });
      }
    }

    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (e) {
    console.error("[public assets]", e);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
