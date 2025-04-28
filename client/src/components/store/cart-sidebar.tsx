import { X, Plus, Minus, Trash2, Coins, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/use-cart-store";
import { Button } from "@/components/ui/button";

export function CartSidebar() {
  const {
    items,
    setCheckoutStep,
    isOpen,
    toggleCart,
    removeItem,
    updateQuantity,
  } = useCartStore();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const fee = subtotal * 0.01;
  const total = subtotal + fee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[25rem] bg-blue-700 shadow-lg z-50"
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2 text-white">
                  <ShoppingCart />
                  <h2 className="text-xl font-bold text-white">Your Cart</h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={toggleCart}
                  className="text-white"
                >
                  <X size={24} />
                </Button>
              </div>

              <div className="flex-1 overflow-auto">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="bg-blue-600 rounded-lg p-4 mb-4 flex items-center"
                    >
                      <div className="bg-blue-500/50 rounded-lg overflow-hidden w-16 h-16 mx-auto flex items-center justify-center mr-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">
                          {item.name}
                        </h3>
                        <p className="text-gray-200 text-sm">
                          Rarity: {item.rarity}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-white font-semibold flex items-center justify-end space-x-1">
                            <Coins className="text-yellow-400 mr-1" size={20} />
                            <span>{item.price}</span>
                          </p>
                          <div className="flex items-center mt-2 bg-blue-800/20 rounded-lg border border-white/50 px-2 py-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-white p-1 hover:bg-blue-500/50 rounded"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(0, item.quantity - 1)
                                )
                              }
                            >
                              <Minus size={16} />
                            </motion.button>
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="mx-2 text-white"
                            >
                              {item.quantity}
                            </motion.span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-white p-1 hover:bg-blue-500/50 rounded"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus size={16} />
                            </motion.button>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, color: "#ef4444" }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400 ml-auto p-1 hover:bg-red-500/10 rounded"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Cart Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-white/20 mt-4 p-4 rounded-lg"
              >
                <div className="flex justify-between text-white mb-2">
                  <span>Subtotal:</span>
                  <span className="flex items-center">
                    <Coins className="text-yellow-400 mr-1" size={20} />
                    {subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-white mb-2">
                  <span>Transaction Fee (1%):</span>
                  <span className="flex items-center">
                    <Coins className="text-yellow-400 mr-1" size={20} />
                    {fee}
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold mb-4 border-t border-t-white/20 pt-2">
                  <span>Total:</span>
                  <span className="flex items-center">
                    <Coins className="text-yellow-400 mr-1" size={20} />
                    {total}
                  </span>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => setCheckoutStep("confirm")}
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
