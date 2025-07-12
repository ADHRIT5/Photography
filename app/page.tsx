import Hero from "@/components/Hero"
import Gallery from "@/components/Gallery"
import About from "@/components/About"
import Social from "@/components/Social"
import Footer from "@/components/Footer"
import Navigation from "@/components/Navigation"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Gallery />
      <About />
      <Social />
      <Footer />
    </main>
  )
}
