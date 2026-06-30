/* ===== FAMILY API =====
 * Each returns the FULL updated members array so the
 * Zustand store can sync with a single assignment.
 */
import { apiClient } from "./client";

export const familyApi = {
  /* GET — load all members for the logged-in user */
  getMembers: () =>
    apiClient.get("/api/v1/families"),

  /* POST — add a member, returns updated members array */
  addMember: (member: {
    name: string;
    age: number;
    gender: string;
    diet: string;
    allergies?: string[];
    isGuest?: boolean;
    additionalInfo?: string;
  }) =>
    apiClient.post("/api/v1/families", { member }),

  /* PATCH — update a specific member, returns updated array */
  updateMember: (memberId: string, updates: Record<string, any>) =>
    apiClient.patch(`/api/v1/families/${memberId}`, { memberId, updates }),

  /* DELETE — remove a member, returns updated array */
  deleteMember: (memberId: string) =>
    apiClient.delete("/api/v1/families", { memberId }),
};
