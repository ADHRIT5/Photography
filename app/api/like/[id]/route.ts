import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const photo = await Photo.findByIdAndUpdate(params.id, { $inc: { likes: 1 } }, { new: true })

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    return NextResponse.json({ likes: photo.likes })
  } catch (error) {
    return NextResponse.json({ error: "Failed to like photo" }, { status: 500 })
  }
}
