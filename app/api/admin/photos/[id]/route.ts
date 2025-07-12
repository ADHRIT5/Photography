import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Photo from "@/models/Photo"
import { del } from "@vercel/blob"

const JWT_SECRET = process.env.JWT_SECRET || "0n74qzl7nwys8ys528rnl6l1eume1yu2"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    jwt.verify(token, JWT_SECRET)

    await connectDB()

    // Get photo details before deletion to delete from blob storage
    const photo = await Photo.findById(params.id)
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    // Delete from blob storage if it's a blob URL
    if (photo.imageUrl && photo.imageUrl.includes("blob.vercel-storage.com")) {
      try {
        await del(photo.imageUrl)
      } catch (blobError) {
        console.error("Error deleting from blob storage:", blobError)
        // Continue with database deletion even if blob deletion fails
      }
    }

    // Delete from database
    await Photo.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 })
  }
}
