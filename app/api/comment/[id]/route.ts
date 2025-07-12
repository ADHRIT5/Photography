import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 })
    }

    const comment = {
      text: text.trim(),
      createdAt: new Date(),
    }

    const photo = await Photo.findByIdAndUpdate(params.id, { $push: { comments: comment } }, { new: true })

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    const newComment = photo.comments[photo.comments.length - 1]
    return NextResponse.json(newComment)
  } catch (error) {
    console.error("Comment error:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
