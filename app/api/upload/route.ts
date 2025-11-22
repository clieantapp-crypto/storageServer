import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const isPublic = formData.get("isPublic") === "true"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check user's storage limit
    const { data: profile } = await supabase
      .from("profiles")
      .select("storage_used, storage_limit")
      .eq("id", user.id)
      .single()

    if (profile && profile.storage_used + file.size > profile.storage_limit) {
      return NextResponse.json({ error: "Storage limit exceeded" }, { status: 403 })
    }

    // Upload to Vercel Blob
    const blob = await put(`${user.id}/${file.name}`, file, {
      access: "public",
    })

    // Save metadata to database
    const { data: fileRecord, error: dbError } = await supabase
      .from("files")
      .insert({
        user_id: user.id,
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        blob_url: blob.url,
        is_public: isPublic,
      })
      .select()
      .single()

    if (dbError) {
      throw dbError
    }

    return NextResponse.json({
      success: true,
      file: fileRecord,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
