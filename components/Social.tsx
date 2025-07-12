"use client"

import { Instagram, Mail, Camera } from "lucide-react"

export default function Social() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Connect</h2>
          <p className="text-xl text-gray-600">Let's create something beautiful together</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <a
            href="https://www.instagram.com/__adhrit__"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white hover-lift"
          >
            <Instagram size={48} className="mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-playfair text-2xl font-bold mb-2">Instagram</h3>
            <p className="opacity-90">Follow my daily captures and behind-the-scenes moments</p>
            <span className="text-sm opacity-75 mt-2 block">@__adhrit__</span>
          </a>

          <a
            href="mailto:indianlancer1802@gmail.com"
            className="group bg-gradient-to-br from-blue-500 to-cyan-500 p-8 text-white hover-lift"
          >
            <Mail size={48} className="mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-playfair text-2xl font-bold mb-2">Email</h3>
            <p className="opacity-90">Get in touch for collaborations and bookings</p>
            <span className="text-sm opacity-75 mt-2 block">indianlancer1802@gmail.com</span>
          </a>

          <div className="group bg-gradient-to-br from-gray-700 to-black p-8 text-white hover-lift">
            <Camera size={48} className="mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-playfair text-2xl font-bold mb-2">Portfolio</h3>
            <p className="opacity-90">Explore my complete collection of work</p>
            <span className="text-sm opacity-75 mt-2 block">Available for hire</span>
          </div>
        </div>
      </div>
    </section>
  )
}
