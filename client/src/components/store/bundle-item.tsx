import { motion } from "framer-motion";
import { useCartStore } from "@/store/use-cart-store";

interface BundleItemProps {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    discount: string;
    tag: string;
    rarity: string;
    items: string[];
    description: string;
}

export default function BundleItem({
    id,
    name,
    image,
    price,
    originalPrice,
    discount,    
    rarity,
    items,    
}: BundleItemProps) {
    const { addItem, addToRecentlyViewed } = useCartStore();

    const handleAddToCart = () => {
        const item = {
            id,
            name,
            image,
            price,
            rarity
        };
        addItem(item);
        addToRecentlyViewed(item);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl overflow-hidden shadow-xl border border-blue-400/30 transform transition-all duration-200 relative p-4"
        >
            <div className="flex flex-col md:flex-row">
                {/* Content section */}
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white mb-3">{name}</h3>
                    <div className="text-sm text-blue-100 mb-2">
                        Includes: {items.join(", ")}
                    </div>

                    <div className="flex items-center mt-4">
                        <span className="text-white font-bold text-xl">{price} coins</span>
                        <span className="text-xs text-gray-300 line-through ml-3 mr-3">
                            {originalPrice} coins
                        </span>
                        <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {discount}
                        </span>
                    </div>
                </div>

                {/* Image section */}
                <div className="flex items-center justify-center md:justify-end mt-4 md:mt-0">
                    <div className="relative w-40 h-40 md:mr-4">
                        <img
                            src={image || "/placeholder.svg"}
                            alt={name}
                            className="object-contain h-full transform hover:scale-110 transition-all duration-500"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        className="bg-yellow-500 hover:bg-yellow-600 text-sm text-white font-bold w-full p-2 rounded-md"
                    >
                        Buy Bundle
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
} 