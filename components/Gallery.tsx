"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Photo {
  _id: string
  title: string
  description: string
  imageUrl: string
  likes: number
  comments: Comment[]
  createdAt: string
}

interface Comment {
  _id: string
  text: string
  createdAt: string
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setPhotos(data)
    } catch (error) {
      console.error("Error fetching photos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (photoId: string) => {
    try {
      const response = await fetch(`/api/like/${photoId}`, {
        method: "POST",
      })
      if (response.ok) {
        setPhotos(photos.map((photo) => (photo._id === photoId ? { ...photo, likes: photo.likes + 1 } : photo)))
      }
    } catch (error) {
      console.error("Error liking photo:", error)
    }
  }

  const handleComment = async (photoId: string) => {
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/comment/${photoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newComment }),
      })

      if (response.ok) {
        const comment = await response.json()
        setPhotos(
          photos.map((photo) => (photo._id === photoId ? { ...photo, comments: [...photo.comments, comment] } : photo)),
        )
        setNewComment("")
        if (selectedPhoto && selectedPhoto._id === photoId) {
          setSelectedPhoto({
            ...selectedPhoto,
            comments: [...selectedPhoto.comments, comment],
          })
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Gallery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Gallery</h2>
          <p className="text-xl text-gray-600">A collection of captured moments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo, index) => (
            <div
              key={photo._id}
              className="group cursor-pointer hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative overflow-hidden bg-white shadow-lg">
                <div className="relative h-80">
                  <Image
                    src={photo.imageUrl || "/placeholder.svg"}
                    alt={photo.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                </div>

                <div className="p-6">
                  <h3 className="font-playfair text-xl font-semibold mb-2">{photo.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{photo.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(photo._id)
                        }}
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart size={18} />
                        <span>{photo.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MessageCircle size={18} />
                        <span>{photo.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white">
              <div className="relative">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="relative h-96 md:h-[500px]">
                  <Image
                    src={selectedPhoto.imageUrl || "/placeholder.svg"}
                    alt={selectedPhoto.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold mb-2">{selectedPhoto.title}</h3>
                  <p className="text-gray-700 mb-6">{selectedPhoto.description}</p>

                  <div className="flex items-center space-x-6 mb-6">
                    <button
                      onClick={() => handleLike(selectedPhoto._id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Heart size={20} />
                      <span>{selectedPhoto.likes} likes</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Comments ({selectedPhoto.comments.length})</h4>

                    <div className="space-y-4 mb-6">
                      {selectedPhoto.comments.map((comment) => (
                        <div key={comment._id} className="bg-gray-50 p-4 rounded">
                          <p className="text-gray-800">{comment.text}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={() => handleComment(selectedPhoto._id)} disabled={!newComment.trim()}>
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
