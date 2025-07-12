import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    jwt.verify(token, JWT_SECRET)

    const formData = await request.formData()
    const file = formData.get("image") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    // Save to database
    await connectDB()
    const photo = new Photo({
      title,
      description,
      imageUrl: blob.url,
      likes: 0,
      comments: [],
    })

    await photo.save()

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
