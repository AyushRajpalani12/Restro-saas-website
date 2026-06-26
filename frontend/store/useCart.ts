import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number; // calculated item unit price (base + variant + addons)
  quantity: number;
  selectedVariant?: {
    name: string;
    price: number;
  };
  selectedAddons: Array<{
    name: string;
    price: number;
  }>;
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  restaurantSlug: string | null;
  tableNumber: string | null;
  coupon: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderValue: number;
  } | null;
  setSession: (slug: string, table: string) => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCoupon: (coupon: CartState["coupon"]) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantSlug: null,
      tableNumber: null,
      coupon: null,
      setSession: (slug, table) => set({ restaurantSlug: slug, tableNumber: table }),
      addItem: (item) => {
        const { items } = get();
        const id = `${item.menuItemId}-${item.selectedVariant?.name || ""}-${item.selectedAddons
          .map((a) => a.name)
          .sort()
          .join(",")}`;

        const existingIndex = items.findIndex((i) => i.id === id);

        if (existingIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity += item.quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { ...item, id }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      setCoupon: (coupon) => set({ coupon }),
      clearCart: () => set({ items: [], coupon: null }),
    }),
    {
      name: "restro-saas-cart",
    }
  )
);
export default useCart;
