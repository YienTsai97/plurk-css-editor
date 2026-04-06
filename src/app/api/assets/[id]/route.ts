import { prisma } from "@/lib/db"
import { supabaseServer } from "@/lib/supabaseServer"
import { requireAuth } from "@/services/auth.service"
import { NextRequest, NextResponse } from "next/server"

const BUCKET_NAME = "pcg-assets"

type RouteParams = {
  params: { id: string }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) return authResult.response;
    const { userId } = authResult;

    //Next.js 13+ / 14 : Params are lazy async values need to be awaited
    const { id: assetId } = await params;

    const asset = await prisma.asset.findFirst({
      where: { id: assetId, userId },
    });

    //check asset existence
    if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });

    //Delete from Supabase Storage
    if (asset.bucket && asset.key) {
      // if remove success , the removeError will be null and undefined
      const { error: removeError } = await supabaseServer.storage.from(asset.bucket).remove([asset.key])
      //  when remove Error exist, deletion failed
      if (removeError) {
        console.error("Error deleting from Supabase Storage:", removeError)
        return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 })
      }
    }

    //Delete from DB
    await prisma.asset.delete({
      where: { id: assetId },
    })
    // ProjectAsset / StyleTemplateAsset 會透過 onDelete: Cascade 一起被刪掉
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  catch (error) {
    console.error("Error deleting asset:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}