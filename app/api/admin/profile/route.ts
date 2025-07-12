import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Profile from "@/models/Profile"

const JWT_SECRET = process.env.JWT_SECRET || "0n74qzl7nwys8ys528rnl6l1eume1yu2"

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get("profileImage") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`profile-${Date.now()}.${file.name.split(".").pop()}`, file, {
      access: "public",
    })

    // Save to database
    await connectDB()

    // Update or create profile
    const profile = await Profile.findOneAndUpdate(
      {},
      {
        profileImageUrl: blob.url,
        updatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      },
    )

    return NextResponse.json({
      success: true,
      profile: {
        _id: profile._id,
        profileImageUrl: profile.profileImageUrl,
        updatedAt: profile.updatedAt,
      },
    })
  } catch (error) {
    console.error("Profile upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const profile = await Profile.findOne().sort({ updatedAt: -1 })

    if (!profile) {
      return NextResponse.json({ profileImageUrl: null })
    }

    return NextResponse.json({
      _id: profile._id,
      profileImageUrl: profile.profileImageUrl,
      updatedAt: profile.updatedAt,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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
    await Profile.deleteMany({})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
