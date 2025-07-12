import { Instagram, Mail } from "lucide-react"

export default function Social() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8">Connect</h2>
        <p className="text-xl text-gray-600 mb-12">Let's create something beautiful together</p>

        <div className="flex justify-center space-x-8">
          <a
            href="https://www.instagram.com/__adhrit__"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 bg-white px-8 py-4 rounded-none shadow-lg hover-lift group"
          >
            <Instagram size={24} className="group-hover:text-pink-500 transition-colors" />
            <span className="font-medium">Instagram</span>
          </a>

          <a
            href="mailto:indianlancer1802@gmail.com"
            className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-none shadow-lg hover-lift group"
          >
            <Mail size={24} />
            <span className="font-medium">Email</span>
          </a>
        </div>
      </div>
    </section>
  )
}
