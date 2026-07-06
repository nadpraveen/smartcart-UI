/* ===== GLOBAL STATE (ZUSTAND) =====
 * Persisted to localStorage via zustand/middleware/persist.
 * Family operations now sync with backend API —
 * each mutation calls the API then replaces the full local array
 * with the response (single source of truth = server).
 *
 * Tokens are synced to cookies (via client.ts helpers) so the
 * API client can read them for Bearer auth. The backend
 * authGuard stays completely unchanged.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { familyApi } from "@/lib/api/family";
import { preferencesApi } from "@/lib/api/preferences";
import { setTokens, clearTokens } from "@/lib/api/client";

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
  planType: PlanType;
  selectedMembers: string[];
};

export type CartItem = {
  name: string;
  price: number;
  category?: string;
  quantity: number;
};

// Extended User type — now includes id and tokens
export type User = {
  id: string;
  name: string;
  phone: string;
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
};

// ===== STORE TYPE =====
type Store = {
  user: User;
  family: FamilyMember[];
  familyLoading: boolean;
  familyError: string | null;
  preferences: Preferences;
  preferencesLoading: boolean;
  preferencesError: string | null;

  cartState: CartItem[];
  cartTotal: number;

  /* Auth actions */
  setUser: (user: { name?: string; phone: string }) => void;
  setUserAfterAuth: (data: {
    user: { _id: string; name: string; phone: string };
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;

  /* Family actions — API-backed */
  loadFamily: () => Promise<void>;
  addMember: (member: Omit<FamilyMember, "id">) => Promise<void>;
  updateMember: (member: FamilyMember) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;

  setPreferences: (p: Partial<Preferences>) => void;
  loadPrefs: () => Promise<void>;
  savePrefs: () => Promise<void>;
  updateBudget: (budget: number) => Promise<void>;

  setCartState: (cart: CartItem[]) => void;
};

/* ===== Helper: convert MongoDB _id to local id ===== */
function mapMembers(members: any[]): FamilyMember[] {
  return members.map((m: any) => ({
    ...m,
    id: m._id || m.id,
  }));
}

// ===== STORE =====
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

      family: [],
      familyLoading: false,
      familyError: null,
      preferences: {
        budget: 2000,
        mode: "balanced",
        planType: "monthly",
        selectedMembers: [],
      },
      preferencesLoading: false,
      preferencesError: null,

      cartState: [],
      cartTotal: 0,

      // ===== USER =====

      /* Legacy — kept for backward compat, just sets name+phone */
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

      /* Called after successful register/login API response.
       * Stores tokens in BOTH Zustand (persisted) AND cookies
       * (so apiClient can read them for Bearer auth). */
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

      /* Clears user state AND cookies */
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
          family: [],
        }));
      },

      // ===== FAMILY (API-backed) =====

      /* Fetch all members from backend → replace local state */
      loadFamily: async () => {
        set(() => ({ familyLoading: true, familyError: null }));
        try {
          const members = await familyApi.getMembers();
          set(() => ({ family: mapMembers(members), familyLoading: false }));
        } catch (err: any) {
          set(() => ({ familyError: err.message || "Failed to load family", familyLoading: false }));
        }
      },

      /* Add member → API returns full updated array → replace local */
      addMember: async (member) => {
        set(() => ({ familyLoading: true, familyError: null }));
        try {
          const members = await familyApi.addMember(member);
          set(() => ({ family: mapMembers(members), familyLoading: false }));
        } catch (err: any) {
          set(() => ({ familyError: err.message || "Failed to add member", familyLoading: false }));
        }
      },

      /* Update member → API returns full updated array → replace local */
      updateMember: async (member) => {
        set(() => ({ familyLoading: true, familyError: null }));
        try {
          const { id, ...updates } = member;
          const members = await familyApi.updateMember(id, updates);
          set(() => ({ family: mapMembers(members), familyLoading: false }));
        } catch (err: any) {
          set(() => ({ familyError: err.message || "Failed to update member", familyLoading: false }));
        }
      },

      /* Delete member → API returns full updated array → replace local */
      deleteMember: async (id) => {
        set(() => ({ familyLoading: true, familyError: null }));
        try {
          const members = await familyApi.deleteMember(id);
          set(() => ({ family: mapMembers(members), familyLoading: false }));
        } catch (err: any) {
          set(() => ({ familyError: err.message || "Failed to delete member", familyLoading: false }));
        }
      },

      // ===== PREFERENCES (API-backed) =====

      /* Local-only update for instant UI responsiveness.
       * Call savePrefs() to persist to backend. */
      setPreferences: (p) =>
        set((state) => ({ preferences: { ...state.preferences, ...p } })),

      /* GET — load prefs from API on page mount.
       * Merges into local state so UI stays responsive. */
      loadPrefs: async () => {
        set(() => ({ preferencesLoading: true, preferencesError: null }));
        try {
          const data = await preferencesApi.get();
          set(() => ({
            preferences: {
              budget: data.budget ?? 2000,
              mode: data.mode ?? "balanced",
              planType: data.planType ?? "monthly",
              selectedMembers: data.selectedMembers ?? [],
            },
            preferencesLoading: false,
          }));
        } catch (err: any) {
          set(() => ({
            preferencesError: err.message || "Failed to load preferences",
            preferencesLoading: false,
          }));
        }
      },

      /* POST — full save when user clicks "Generate Smart Cart".
       * Sends current local state → recalculates plan. */
      savePrefs: async () => {
        const { preferences } = get();
        set(() => ({ preferencesLoading: true, preferencesError: null }));
        try {
          const data = await preferencesApi.save(preferences);
          set(() => ({
            preferences: {
              budget: data.budget,
              mode: data.mode,
              planType: data.planType,
              selectedMembers: data.selectedMembers ?? [],
            },
            preferencesLoading: false,
          }));
        } catch (err: any) {
          set(() => ({
            preferencesError: err.message || "Failed to save preferences",
            preferencesLoading: false,
          }));
        }
      },

      /* PUT — quick budget auto-save from slider.
       * Optimistic: updates local first, then confirms with API. */
      updateBudget: async (budget) => {
        get().setPreferences({ budget });
        // try {
        //   const data = await preferencesApi.updateBudget(budget);
        //   set(() => ({
        //     preferences: {
        //       budget: data.budget,
        //       mode: data.mode,
        //       planType: data.planType,
        //       selectedMembers: data.selectedMembers ?? [],
        //     },
        //   }));
        // } catch {
        //   /* Revert on failure — assume backend returns latest known value.
        //    * In practice, this should never fail since upsert handles missing docs. */
        //   get().loadPrefs();
        // }
      },

      // ===== CART =====
      setCartState: (cart) =>
        set(() => ({
          cartState: cart,
          cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        })),
    }),
    {
      name: "smart-cart",
      /* We persist everything EXCEPT family (live data from server).
       * On page refresh, family is re-fetched via loadFamily(). */
      partialize: (state) => ({
        user: state.user,
        preferences: state.preferences,
        cartState: state.cartState,
        cartTotal: state.cartTotal,
      }),
    },
  ),
);
