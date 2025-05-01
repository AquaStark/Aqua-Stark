import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  recentlyViewed: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity" | "id"> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  addToRecentlyViewed: (item: Omit<CartItem, "quantity" | "id"> & { id?: string }) => void;
  checkoutStep: "cart" | "confirm" | "processing" | "success";
  setCheckoutStep: (step: CartStore["checkoutStep"]) => void;
  processCheckout: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  recentlyViewed: [],
  isOpen: false,
  addItem: (item) =>
    set((state) => {
      const itemId = item.id || `item_${uuidv4()}`;
      const existingItem = state.items.find((i) => i.id === itemId);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [...state.items, { ...item, id: itemId, quantity: 1 }],
      };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  addToRecentlyViewed: (item) =>
    set((state) => {
      const itemId = item.id || `item_${uuidv4()}`;
      const exists = state.recentlyViewed.some((i) => i.id === itemId);
      if (exists) return state;
      const newRecentlyViewed = [
        { ...item, id: itemId, quantity: 1 },
        ...state.recentlyViewed,
      ].slice(0, 4);
      return { recentlyViewed: newRecentlyViewed };
    }),
  checkoutStep: "cart",
  setCheckoutStep: (step) => set({ checkoutStep: step }),
  processCheckout: async () => {
    set({ checkoutStep: "processing" });
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 3000));
    set({ checkoutStep: "success" });
    // Reset cart after successful purchase
    setTimeout(() => {
      set({ items: [], checkoutStep: "cart", isOpen: false });
    }, 3000);
  },
}));
