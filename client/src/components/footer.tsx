import { Link } from "react-router-dom"
export function Footer(){
    return (
        <footer className="relative z-10 bg-blue-800 py-6 border-t-2 border-blue-400/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80 mb-2">© 2025 Aqua Stark - All rights reserved</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="#" className="text-white hover:text-blue-200 transition-colors">
              Polity and Privacy
            </Link>
            <Link to="#" className="text-white hover:text-blue-200 transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-white hover:text-blue-200 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    )
}