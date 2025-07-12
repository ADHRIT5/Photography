import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"

const JWT_SECRET = process.env.JWT_SECRET || "0n74qzl7nwys8ys528rnl6l1eume1yu2"

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch (jwtError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("image") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`photo-${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Save to database
    await connectDB()
    const photo = new Photo({
      title: title.trim(),
      description: description.trim(),
      imageUrl: blob.url,
      likes: 0,
      comments: [],
      createdAt: new Date(),
    })

    const savedPhoto = await photo.save()

    return NextResponse.json({
      success: true,
      photo: {
        _id: savedPhoto._id,
        title: savedPhoto.title,
        description: savedPhoto.description,
        imageUrl: savedPhoto.imageUrl,
        likes: savedPhoto.likes,
        comments: savedPhoto.comments,
        createdAt: savedPhoto.createdAt,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
