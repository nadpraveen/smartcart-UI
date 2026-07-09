import { create } from "zustand";
import { persist } from "zustand/middleware";
import { preferencesApi } from "@/lib/api/preferences";
import { setTokens, clearTokens } from "@/lib/api/client";

export type Mode = "budget" | "balanced" | "premium";
export type PlanType = "weekly" | "monthly";
export type FoodPreference = "veg" | "non-veg" | "both";

export type Preferences = {
  budget: number;
  mode: Mode;
  planType: PlanType;
};

export type CartItem = {
  name: string;
  price: number;
  category?: string;
  quantity: number;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
};

type Store = {
  user: User;
  foodPreference: FoodPreference;
  householdAllergies: string[];
  familyMemberCount: number;
  deliveryAddress: {
    address: string;
    landmark: string;
    pincode: string;
  };
  preferences: Preferences;
  cartState: CartItem[];
  cartTotal: number;

  setUser: (user: { name?: string; phone: string }) => void;
  setUserAfterAuth: (data: {
    user: { _id: string; name: string; phone: string };
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;

  setFoodPreference: (value: FoodPreference) => void;
  setHouseholdAllergies: (allergies: string[]) => void;
  setFamilyMemberCount: (count: number) => void;
  setDeliveryAddress: (address: { address: string; landmark: string; pincode: string }) => void;

  setPreferences: (p: Partial<Preferences>) => void;
  loadPrefs: () => Promise<void>;
  savePrefs: () => Promise<void>;
  updateBudget: (budget: number) => Promise<void>;

  setCartState: (cart: CartItem[]) => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: {
        id: "",
        name: "",
        phone: "",
        isLoggedIn: false,
        accessToken: "",
        refreshToken: "",
      },
      foodPreference: "veg",
      householdAllergies: [],
      familyMemberCount: 1,
      deliveryAddress: { address: "", landmark: "", pincode: "" },
      preferences: {
        budget: 2000,
        mode: "balanced",
        planType: "monthly",
      },
      cartState: [],
      cartTotal: 0,

      setUser: (user) =>
        set(() => ({
          user: {
            id: "",
            name: user.name || "",
            phone: user.phone,
            isLoggedIn: true,
            accessToken: "",
            refreshToken: "",
          },
        })),

      setUserAfterAuth: (data) => {
        setTokens(data.accessToken, data.refreshToken);
        set(() => ({
          user: {
            id: data.user._id,
            name: data.user.name,
            phone: data.user.phone,
            isLoggedIn: true,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          },
        }));
      },

      logout: () => {
        clearTokens();
        set(() => ({
          user: {
            id: "",
            name: "",
            phone: "",
            isLoggedIn: false,
            accessToken: "",
            refreshToken: "",
          },
        }));
      },

      setFoodPreference: (value) => set(() => ({ foodPreference: value })),
      setHouseholdAllergies: (allergies) => set(() => ({ householdAllergies: allergies })),
      setFamilyMemberCount: (count) => set(() => ({ familyMemberCount: count })),
      setDeliveryAddress: (address) => set(() => ({ deliveryAddress: address })),

      setPreferences: (p) =>
        set((state) => ({ preferences: { ...state.preferences, ...p } })),

      loadPrefs: async () => {
        try {
          const data = await preferencesApi.get();
          set(() => ({
            preferences: {
              budget: data.budget ?? 2000,
              mode: data.mode ?? "balanced",
              planType: data.planType ?? "monthly",
            },
          }));
        } catch {
          // silently fail, keep defaults
        }
      },

      savePrefs: async () => {
        const { preferences } = get();
        const data = await preferencesApi.save(preferences);
        set(() => ({
          preferences: {
            budget: data.budget,
            mode: data.mode,
            planType: data.planType,
          },
        }));
      },

      updateBudget: async (budget) => {
        get().setPreferences({ budget });
      },

      setCartState: (cart) =>
        set(() => ({
          cartState: cart,
          cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        })),
    }),
    {
      name: "smart-cart",
      partialize: (state) => ({
        user: state.user,
        foodPreference: state.foodPreference,
        householdAllergies: state.householdAllergies,
        familyMemberCount: state.familyMemberCount,
        deliveryAddress: state.deliveryAddress,
        preferences: state.preferences,
        cartState: state.cartState,
        cartTotal: state.cartTotal,
      }),
    },
  ),
);
