import { ArrowLeft, Coins, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";

export function StoreHeader() {
  const { items, toggleCart } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="relative z-10 flex items-center justify-between p-4 bg-blue-600 border-b-2 border-blue-400/50">
      <Link to="/" className="flex items-center">
        <Button
          variant="ghost"
          className="mr-2 text-white rounded-full hover:bg-blue-500/50"
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
        <Button
          variant="ghost"
          className="relative text-white rounded-full hover:bg-blue-500/50"
          onClick={toggleCart}
        >
          <ShoppingCart className="mr-2" />
          {itemCount > 0 && (
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
              {itemCount}
            </span>
          )}
        </Button>
        <div className="flex items-center px-4 py-2 border rounded-full bg-blue-700/50 border-blue-400/50">
          <Coins className="mr-2 text-yellow-400" size={20} />
          <span className="font-bold text-white">12,500</span>
        </div>
      </div>
    </nav>
  );
}
