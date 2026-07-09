import { apiClient } from "./client";

export const userApi = {
  updateProfile: (data: {
    name?: string;
    foodPreference?: string;
    householdAllergies?: string[];
    familyMemberCount?: number;
    deliveryAddress?: {
      address: string;
      landmark: string;
      pincode: string;
    };
  }) => apiClient.put("/api/v1/users/profile", data),
};
