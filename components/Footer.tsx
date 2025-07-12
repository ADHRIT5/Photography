export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="font-playfair text-2xl font-bold mb-4">Adhrit</h3>
          <p className="text-gray-400 mb-8">Photography Portfolio</p>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">© {new Date().getFullYear()} Adhrit. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
