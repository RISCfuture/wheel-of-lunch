import { Home, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-orange-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to discovering great lunch spots!
        </p>
        
        <Link
          href="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <Home className="w-4 h-4" />
          Back to Wheel of Lunch
        </Link>
      </div>
    </div>
  )
}