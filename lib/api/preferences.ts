/* ===== PREFERENCES API =====
 * Each endpoint returns the full preferences object.
 */
import { apiClient } from "./client";

export const preferencesApi = {
  /* GET — load preferences for the logged-in user */
  get: () => apiClient.get("/api/v1/preferences"),

  /* POST — full save (create or update) */
  save: (data: {
    budget: number;
    mode: string;
    planType: string;
    selectedMembers: string[];
  }) => apiClient.post("/api/v1/preferences", data),

  /* PUT — quick budget update */
  updateBudget: (budget: number) =>
    apiClient.put("/api/v1/preferences", { budget }),
};
