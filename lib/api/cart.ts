import { apiClient } from "./client";

export const generateCart = async () => {
  const res = await apiClient.get("/api/v1/carts");

  return res.json();
};

/* GET /api/v1/carts/active — fetch the current user's active cart */
export const getActiveCart = () =>
  apiClient.get("/api/v1/carts/active");
