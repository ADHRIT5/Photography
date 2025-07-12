"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Upload, Trash2, Eye, User, Globe, X } from "lucide-react"
import Image from "next/image"

interface Photo {
  _id: string
  title: string
  description: string
  imageUrl: string
  likes: number
  comments: any[]
  createdAt: string
}

interface Profile {
  _id?: string
  profileImageUrl: string
}

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    file: null as File | null,
  })

  useEffect(() => {
    fetchPhotos()
    fetchProfile()
  }, [])

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/photos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setPhotos(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching photos:", error)
      setPhotos([])
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/admin/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("image", uploadForm.file)
    formData.append("title", uploadForm.title)
    formData.append("description", uploadForm.description)

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        setUploadForm({ title: "", description: "", file: null })
        fetchPhotos()
        // Reset file input
        const fileInput = document.getElementById("file-input") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingProfile(true)
    const formData = new FormData()
    formData.append("profileImage", file)

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        fetchProfile()
      }
    } catch (error) {
      console.error("Profile upload error:", error)
    } finally {
      setUploadingProfile(false)
    }
  }

  const handleDeleteProfile = async () => {
    if (!confirm("Are you sure you want to delete your profile picture?")) return

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/profile/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setProfile(null)
        fetchProfile()
      }
    } catch (error) {
      console.error("Profile delete error:", error)
    }
  }

  const handleDelete = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/admin/photos/${photoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchPhotos()
      }
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const handleViewWebsite = () => {
    window.open("/", "_blank")
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-white">
        {/* Preview Header */}
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={() => setShowPreview(false)} className="bg-black hover:bg-gray-800 text-white shadow-lg">
            <X size={16} className="mr-2" />
            Back to Admin
          </Button>
        </div>

        {/* Website Preview - This would be your main website content */}
        <iframe src="/" className="w-full h-screen border-0" title="Website Preview" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="font-playfair text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleViewWebsite}
                variant="outline"
                className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 border-blue-600"
              >
                <Globe size={16} />
                <span>View Website</span>
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                className="flex items-center space-x-2 text-white bg-black hover:bg-gray-800 border-black"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Picture Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User size={20} />
              <span>Profile Picture</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                  {profile?.profileImageUrl ? (
                    <Image
                      src={profile.profileImageUrl || "/placeholder.svg"}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileUpload}
                    className="hidden"
                    id="profile-upload"
                  />
                  <Button
                    onClick={() => document.getElementById("profile-upload")?.click()}
                    disabled={uploadingProfile}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {uploadingProfile ? "Uploading..." : "Upload Profile Picture"}
                  </Button>
                  {profile?.profileImageUrl && (
                    <Button onClick={handleDeleteProfile} variant="destructive" size="sm">
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">Recommended: Square image, at least 200x200px</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload size={20} />
              <span>Upload New Photo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Photo Title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  required
                />
                <Input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  required
                />
              </div>
              <Textarea
                placeholder="Photo Description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                required
              />
              <Button type="submit" disabled={uploading} className="bg-black hover:bg-gray-800 text-white">
                {uploading ? "Uploading..." : "Upload Photo"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Card key={photo._id}>
              <div className="relative h-48">
                <Image
                  src={photo.imageUrl || "/placeholder.svg"}
                  alt={photo.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{photo.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{photo.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{photo.likes} likes</span>
                  <span>{photo.comments.length} comments</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/#gallery`, "_blank")}
                    className="flex-1"
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(photo._id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No photos uploaded yet. Upload your first photo above!</p>
          </div>
        )}
      </div>
    </div>
  )
}
