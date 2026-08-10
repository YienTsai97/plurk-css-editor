import { prisma } from "@/lib/db"
import { supabaseServer } from "@/lib/supabaseServer"
import { requireAuth } from "@/services/auth.service"
import { NextRequest, NextResponse } from "next/server"

const BUCKET_NAME = "pcg-assets"

const uploadImage = async (request: NextRequest) => {
  let storageKey: string | null = null;
  let uploaded = false;

  try {
    //1. Auth check (user must be logged in)
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    //2.Form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const projectId = formData.get("projectId") as string | null
    const styleTemplateId = formData.get("styleTemplateId") as string | null
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    //3.basic validation
    const mimeType = file.type || "application/octet-stream"
    const size = file.size || 0
    const MAX_FILE_SIZE = 3 * 1024 * 1024 //3MB

    if (size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds the maximum allowed (3MB)" }, { status: 413 })
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedMimeTypes.includes(mimeType)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 })
    }

    // 4. Set storage key in Bucket
    const originalFilename = file.name
    const safeFilename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_")
    const timestamp = Date.now()
    storageKey = `${userId}/${timestamp}-${safeFilename}`

    // 5. Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabaseServer.storage
      .from(BUCKET_NAME)
      .upload(storageKey, buffer, {
        contentType: mimeType,
        upsert: false,
      })
    if (uploadError) {
      console.error("Error uploading to Supabase Storage:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    uploaded = true;


    //6. Get public URL
    const { data } = supabaseServer.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storageKey!)
    const publicUrl = data.publicUrl

    //7. Create Asset record in DB
    const asset = await prisma.$transaction(async (tx) => {
      const created = await tx.asset.create({
        data: {
          userId,
          provider: "SUPABASE",
          bucket: BUCKET_NAME,
          key: storageKey!,
          url: publicUrl,
          size,
          mime: mimeType,
        },
      });

      //8. Create asset association with project or style template
      if (projectId) {
        await tx.projectAsset.create({
          data: { projectId, assetId: created.id },
        });
      }
      if (styleTemplateId) {
        await tx.styleTemplateAsset.create({
          data: { styleTemplateId, assetId: created.id },
        });
      }

      return created;
    });


    //9. Return success response
    return NextResponse.json({
      success: true,
      data: {
        id: asset.id,
        url: publicUrl,
        message: "File uploaded successfully",
      }
    }, { status: 201 })
  } catch (error) {
    if (uploaded && storageKey) {
      await supabaseServer.storage.from(BUCKET_NAME).remove([storageKey]).catch(() => { });
    }
    console.error("Error uploading asset:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const POST = async (request: NextRequest) => {
  return uploadImage(request)
}

const getImages = async () => {
  const authResult = await requireAuth();
  if (!authResult.success) return authResult.response;
  const { userId } = authResult;

  const assets = await prisma.asset.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      url: true,
      createdAt: true,
    },
    take: 100,
  });
  return NextResponse.json({ success: true, data: assets }, { status: 200 });
};


export const GET = async () => {
  return getImages()
}

