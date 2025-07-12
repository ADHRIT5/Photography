import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"

export async function GET() {
  try {
    await connectDB()
    const photos = await Photo.find().sort({ createdAt: -1 })
    return NextResponse.json(photos)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}
