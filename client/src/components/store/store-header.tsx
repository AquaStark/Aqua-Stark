import { ArrowLeft, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function StoreHeader() {
  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 border-b-2 border-blue-400/50 relative z-10">
      <Link to="/" className="flex items-center">
        <Button
          variant="ghost"
          className="text-white hover:bg-blue-500/50 rounded-full mr-2"
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png"
          alt="Aqua Stark Logo"
          width={150}
          height={60}
          className="drop-shadow-lg"
        />
      </Link>
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-blue-700/50 rounded-full px-4 py-2 border border-blue-400/50">
          <Coins className="text-yellow-400 mr-2" size={20} />
          <span className="text-white font-bold">12,500</span>
        </div>
      </div>
    </nav>
  );
}
