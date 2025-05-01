import { StoreBundle } from "./store-bundle";
import { CartItem, useCartStore } from "@/store/use-cart-store";
import { Package } from "lucide-react";
import { motion } from "framer-motion";
import { DecorationBundle } from "@/data/mock-store";

interface SpecialBundlesProps {
  bundles: DecorationBundle[];
}

export function SpecialBundles({ bundles }: SpecialBundlesProps) {
  const { addItem, addToRecentlyViewed } = useCartStore();

  const handleBuyBundle = (bundle: DecorationBundle) => {
    const { id, name, image, price } = bundle;

    // Create item object for cart
    const item: CartItem = { id, name, image, price, quantity: 1 };

    setTimeout(() => {
      addItem(item);
      addToRecentlyViewed(item);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Package size={16} className="text-yellow-500" />
        <h2 className="text-xl font-bold text-white">Special Bundles</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {bundles.map((bundle) => (
          <StoreBundle
            key={bundle.id}
            bundle={bundle}
            onBuy={handleBuyBundle}
          />
        ))}
      </div>
    </motion.div>
  );
}
