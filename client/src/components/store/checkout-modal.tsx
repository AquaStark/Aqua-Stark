import { motion } from "framer-motion";
import { Loader2, CheckCircle, ArrowRight, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";

export function CheckoutModal() {
  const { checkoutStep, setCheckoutStep, processCheckout, items } =
    useCartStore();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const serviceFee = subtotal * 0.01; // 1% service fee
  const total = subtotal + serviceFee;

  if (checkoutStep === "cart") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-blue-800 p-6 rounded-2xl max-w-md w-full mx-4 border-2 border-blue-400/30"
      >
        {checkoutStep === "confirm" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Confirm Purchase
            </h2>
            <div className="bg-blue-700/50 p-4 rounded-lg space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-white text-sm"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span className="flex items-center">
                      <Coins className="text-yellow-400 mr-1" size={20} />
                      {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-blue-600 pt-3 space-y-2">
                <div className="flex justify-between text-white/70">
                  <span>Service Fee (1%):</span>
                  <span className="flex items-center">
                    <Coins className="text-yellow-400 mr-1" size={20} />
                    {serviceFee}
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold">
                  <span>Total:</span>
                  <span className="flex items-center">
                    <Coins className="text-yellow-400 mr-1" size={20} />
                    {total}
                  </span>
                </div>
              </div>
            </div>
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12"
              onClick={processCheckout}
            >
              Confirm Purchase
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button
              variant="ghost"
              className="w-full text-white/70 hover:text-black"
              onClick={() => setCheckoutStep("cart")}
            >
              Back to Cart
            </Button>
          </div>
        )}

        {checkoutStep === "processing" && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="animate-spin h-12 w-12 text-blue-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">
              Processing Purchase
            </h3>
            <p className="text-white/70 text-sm">Please wait a moment...</p>
          </div>
        )}

        {checkoutStep === "success" && (
          <div className="py-12 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-white">
                Purchase Complete!
              </h3>
              <p className="text-white/70 text-sm mt-1">
                Items added to your inventory
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
