"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Upload, Trash2, Eye } from "lucide-react"
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

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    file: null as File | null,
  })

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/photos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setPhotos(data)
    } catch (error) {
      console.error("Error fetching photos:", error)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="font-playfair text-2xl font-bold">Admin Dashboard</h1>
            <Button onClick={onLogout} variant="outline" className="flex items-center space-x-2 bg-transparent">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Button type="submit" disabled={uploading} className="bg-black hover:bg-gray-800">
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
                  <Button size="sm" variant="outline" onClick={() => window.open(`/#gallery`, "_blank")}>
                    <Eye size={14} />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(photo._id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
