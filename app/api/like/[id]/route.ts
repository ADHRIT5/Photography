import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 })
    }

    await connectDB()
    const photo = await Photo.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true })

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    return NextResponse.json({ likes: photo.likes })
  } catch (error) {
    console.error("Like error:", error)
    return NextResponse.json({ error: "Failed to like photo" }, { status: 500 })
  }
}
