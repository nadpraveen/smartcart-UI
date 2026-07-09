import { apiClient } from "./client";

export const preferencesApi = {
  get: () => apiClient.get("/api/v1/preferences"),

  save: (data: {
    budget: number;
    mode: string;
    planType: string;
  }) => apiClient.post("/api/v1/preferences", data),

  updateBudget: (budget: number) =>
    apiClient.put("/api/v1/preferences", { budget }),
};

