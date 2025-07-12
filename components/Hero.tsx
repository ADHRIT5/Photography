"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"

interface Profile {
  profileImageUrl: string
  updatedAt?: string
}

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }, [])

  useEffect(() => {
    setIsVisible(true)
    fetchProfile()
  }, [fetchProfile])

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className={`space-y-8 ${isVisible ? "slide-up" : "opacity-0"}`}>
            <div className="space-y-4">
              <h1 className="font-playfair text-6xl md:text-8xl font-bold text-gradient leading-tight">Adhrit</h1>
              <p className="text-xl md:text-2xl text-gray-600 font-light">
                Capturing moments through the lens of artistry
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to my visual journey where every frame tells a story, and every shadow dances with light.
              </p>
              <a
                href="#gallery"
                className="inline-block bg-black text-white px-8 py-3 rounded-none hover:bg-gray-800 transition-all duration-300 hover-lift font-medium"
              >
                View Gallery
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className={`relative ${isVisible ? "fade-in" : "opacity-0"}`} style={{ animationDelay: "0.3s" }}>
            <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
              <Image
                src={profile?.profileImageUrl || "/placeholder.svg?height=500&width=400"}
                alt="Adhrit - Photographer"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                priority
                key={profile?.updatedAt} // Force re-render when profile updates
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
