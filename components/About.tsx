export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>

        <div className="prose prose-lg mx-auto text-center">
          <p className="text-xl leading-relaxed text-gray-700 mb-8">
            I am Adhrit, a passionate photographer who believes in the power of visual storytelling. My journey began
            with a simple fascination for light and shadow, which has evolved into a deep appreciation for the art of
            capturing fleeting moments.
          </p>

          <p className="text-lg leading-relaxed text-gray-600 mb-8">
            Through my lens, I explore the intersection of emotion and aesthetics, creating images that speak to the
            soul. Each photograph is a carefully crafted narrative, designed to evoke feelings and memories that
            transcend the boundaries of time.
          </p>

          <p className="text-lg leading-relaxed text-gray-600">
            My work is characterized by a minimalist approach, focusing on the essential elements that make each moment
            unique. I believe that true beauty lies in simplicity, and my goal is to capture that essence in every
            frame.
          </p>
        </div>
      </div>
    </section>
  )
}
