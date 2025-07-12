import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"

export async function GET() {
  try {
    await connectDB()
    const photos = await Photo.find().sort({ createdAt: -1 })
    return NextResponse.json(photos || [])
  } catch (error) {
    console.error("Gallery fetch error:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of error
  }
}
