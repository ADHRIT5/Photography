import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"

const JWT_SECRET = process.env.JWT_SECRET || "0n74qzl7nwys8ys528rnl6l1eume1yu2"

export async function GET(request: NextRequest) {
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

    await connectDB()
    const photos = await Photo.find().sort({ createdAt: -1 })

    return NextResponse.json(photos)
  } catch (error) {
    console.error("Fetch photos error:", error)
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}
