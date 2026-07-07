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

  /* Family actions — local-only until saveFamilyMembers() */
  loadFamily: () => Promise<void>;
  addMemberLocal: (member: Omit<FamilyMember, "id">) => void;
  updateMemberLocal: (member: FamilyMember) => void;
  deleteMemberLocal: (id: string) => void;
  saveFamilyMembers: () => Promise<void>;

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

      /* ===== LOCAL-ONLY MUTATIONS =====
       * These ONLY update the in-memory Zustand array.
       * No API calls happen until saveFamilyMembers() is invoked.
       */

      /* Add member — local state only, generates UUID for temp id */
      addMemberLocal: (member) =>
        set((state) => ({
          family: [...state.family, { ...member, id: crypto.randomUUID() }],
        })),

      /* Update member — local state only */
      updateMemberLocal: (member) =>
        set((state) => ({
          family: state.family.map((m) => (m.id === member.id ? member : m)),
        })),

      /* Delete member — local state only */
      deleteMemberLocal: (id) =>
        set((state) => ({
          family: state.family.filter((m) => m.id !== id),
        })),

      /* ===== BATCH SAVE =====
       * Sends ALL current local members to the backend in one atomic call.
       * Existing members (with MongoDB ObjectId as `id`) carry their `_id`
       * so the server preserves them. New members (UUID ids) are sent
       * without `_id` so Mongoose auto-generates ObjectIds.
       * On success, local state is replaced with the server response.
       */
      saveFamilyMembers: async () => {
        set(() => ({ familyLoading: true, familyError: null }));
        try {
          const { family } = get();

          // Map `id` → `_id` for members that originally came from MongoDB
          const membersToSave = family.map((m) => {
            const isMongoId = /^[0-9a-f]{24}$/i.test(m.id);
            return {
              name: m.name,
              age: m.age,
              gender: m.gender,
              diet: m.diet,
              allergies: m.allergies,
              isGuest: m.isGuest,
              additionalInfo: m.additionalInfo,
              ...(isMongoId ? { _id: m.id } : {}),
            };
          });

          const saved = await familyApi.saveMembers(membersToSave);

          // Replace local state using server response (contains real _ids)
          set(() => ({
            family: saved.map((m: any) => ({
              ...m,
              id: m._id || m.id,
            })),
            familyLoading: false,
          }));
        } catch (err: any) {
          set(() => ({
            familyError: err.message || "Failed to save family members",
            familyLoading: false,
          }));
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
