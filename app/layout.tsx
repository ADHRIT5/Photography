import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Adhrit - Photography Portfolio",
  description: "Premium photography portfolio showcasing the artistic vision of Adhrit",
  keywords: "photography, portfolio, art, black and white, professional photographer",
  openGraph: {
    title: "Adhrit - Photography Portfolio",
    description: "Premium photography portfolio showcasing the artistic vision of Adhrit",
    type: "website",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white text-black antialiased">{children}</body>
    </html>
  )
}
