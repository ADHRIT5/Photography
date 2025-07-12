import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { text } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 })
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 })
    }

    await connectDB()

    const newComment = {
      _id: new Date().getTime().toString(),
      text: text.trim(),
      createdAt: new Date(),
    }

    const photo = await Photo.findByIdAndUpdate(id, { $push: { comments: newComment } }, { new: true })

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    return NextResponse.json(newComment)
  } catch (error) {
    console.error("Comment error:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
