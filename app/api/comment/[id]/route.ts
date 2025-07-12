import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { text } = await request.json()

    const comment = {
      text,
      createdAt: new Date(),
    }

    const photo = await Photo.findByIdAndUpdate(params.id, { $push: { comments: comment } }, { new: true })

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    const newComment = photo.comments[photo.comments.length - 1]
    return NextResponse.json(newComment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
