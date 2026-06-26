import { create } from "zustand";
import { persist } from "zustand/middleware";

// ===== TYPES =====
export type Mode = "budget" | "balanced" | "premium";
export type PlanType = "weekly" | "monthly";

export type FamilyMember = {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  diet: "veg" | "non-veg";
  allergies: string[];
  isGuest: boolean;
  additionalInfo?: string;
};

export type Preferences = {
  budget: number;
  mode: Mode;
};

// ✅ NEW: Cart Item Type
export type CartItem = {
  name: string;
  price: number;
  category?: string;
  quantity: number;
};

// ===== USER TYPE =====
export type User = {
  name: string;
  phone: string;
  isLoggedIn: boolean;
};

// ===== STORE TYPE =====
type Store = {
  user: User;
  family: FamilyMember[];
  preferences: Preferences;

  selectedMembers: string[];
  planType: PlanType;

  // ✅ NEW
  cartState: CartItem[];
  cartTotal: number;

  setUser: (user: { name?: string; phone: string }) => void;
  logout: () => void;

  addMember: (member: FamilyMember) => void;
  updateMember: (member: FamilyMember) => void;
  deleteMember: (id: string) => void;

  setPreferences: (p: Preferences) => void;
  setSelectedMembers: (ids: string[]) => void;
  setPlanType: (type: PlanType) => void;

  // ✅ NEW
  setCartState: (cart: CartItem[]) => void;
};

// ===== STORE =====
export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: {
        name: "",
        phone: "",
        isLoggedIn: false,
      },

      family: [],
      preferences: {
        budget: 2000,
        mode: "balanced",
      },

      selectedMembers: [],
      planType: "monthly",

      // ✅ NEW STATE
      cartState: [],
      cartTotal: 0,

      // ===== USER =====
      setUser: (user) =>
        set(() => ({
          user: { name: user.name || "", phone: user.phone, isLoggedIn: true },
        })),

      logout: () =>
        set(() => ({
          user: { name: "", phone: "", isLoggedIn: false },
        })),

      // ===== FAMILY =====
      addMember: (member) =>
        set((state) => ({
          family: [...state.family, member],
        })),

      updateMember: (updated) =>
        set((state) => ({
          family: state.family.map((m) =>
            m.id === updated.id ? updated : m
          ),
        })),

      deleteMember: (id) =>
        set((state) => ({
          family: state.family.filter((m) => m.id !== id),
        })),

      // ===== PREFERENCES =====
      setPreferences: (p) =>
        set(() => ({
          preferences: p,
        })),

      setSelectedMembers: (ids) =>
        set(() => ({
          selectedMembers: ids,
        })),

      setPlanType: (type) =>
        set(() => ({
          planType: type,
        })),

      // ===== CART =====
      setCartState: (cart) =>
        set(() => ({
          cart,
          cartTotal: cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        })),
    }),
    {
      name: "smart-cart",
    }
  )
);