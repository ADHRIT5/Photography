"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Heart, MessageCircle, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"

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
  const [commenting, setCommenting] = useState(false)
  const [liking, setLiking] = useState<string | null>(null)

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch("/api/gallery")
      if (response.ok) {
        const data = await response.json()
        setPhotos(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch photos")
      }
    } catch (error) {
      console.error("Error fetching photos:", error)
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  const handleLike = async (photoId: string) => {
    if (liking === photoId) return

    setLiking(photoId)
    try {
      const response = await fetch(`/api/like/${photoId}`, {
        method: "POST",
      })
      if (response.ok) {
        const data = await response.json()
        setPhotos(photos.map((photo) => (photo._id === photoId ? { ...photo, likes: data.likes } : photo)))
        if (selectedPhoto && selectedPhoto._id === photoId) {
          setSelectedPhoto({ ...selectedPhoto, likes: data.likes })
        }
        toast.success("Liked!")
      } else {
        toast.error("Failed to like photo")
      }
    } catch (error) {
      console.error("Error liking photo:", error)
      toast.error("Failed to like photo")
    } finally {
      setLiking(null)
    }
  }

  const handleComment = async (photoId: string) => {
    if (!newComment.trim() || commenting) return

    setCommenting(true)
    try {
      const response = await fetch(`/api/comment/${photoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newComment.trim() }),
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
        toast.success("Comment added!")
      } else {
        toast.error("Failed to add comment")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setCommenting(false)
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

        {photos.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No photos available yet. Check back soon!</p>
          </div>
        ) : (
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
                      loading="lazy"
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
                          disabled={liking === photo._id}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Heart size={18} className={liking === photo._id ? "animate-pulse" : ""} />
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
        )}

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
                      disabled={liking === selectedPhoto._id}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Heart size={20} className={liking === selectedPhoto._id ? "animate-pulse" : ""} />
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
                        disabled={commenting}
                      />
                      <Button
                        onClick={() => handleComment(selectedPhoto._id)}
                        disabled={!newComment.trim() || commenting}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        {commenting ? (
                          <div className="flex items-center space-x-1">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            <span>Posting...</span>
                          </div>
                        ) : (
                          "Post"
                        )}
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
