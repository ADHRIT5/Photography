import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Profile from "@/models/Profile"
import { del } from "@vercel/blob"

const JWT_SECRET = process.env.JWT_SECRET || "0n74qzl7nwys8ys528rnl6l1eume1yu2"

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    jwt.verify(token, JWT_SECRET)

    await connectDB()

    // Get current profile to delete from blob storage
    const profile = await Profile.findOne()
    if (profile && profile.profileImageUrl && profile.profileImageUrl.includes("blob.vercel-storage.com")) {
      try {
        await del(profile.profileImageUrl)
      } catch (blobError) {
        console.error("Error deleting profile from blob storage:", blobError)
      }
    }

    // Delete profile from database
    await Profile.deleteMany({})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile delete error:", error)
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 })
  }
}
