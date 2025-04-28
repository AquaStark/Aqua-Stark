import { create } from "zustand";

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
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  addToRecentlyViewed: (item: Omit<CartItem, "quantity">) => void;
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
      const existingItem = state.items.find((i) => i.id === item.name);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.name ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [...state.items, { ...item, id: item.name, quantity: 1 }],
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
      const exists = state.recentlyViewed.some((i) => i.id === item.name);
      if (exists) return state;
      const newRecentlyViewed = [
        { ...item, id: item.name, quantity: 1 },
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
