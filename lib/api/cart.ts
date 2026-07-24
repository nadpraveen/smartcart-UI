import { apiClient } from "./client";

export const generateCart = async () => {
  const res = await apiClient.get("/api/v1/carts/active");
  return res;
};

export const regenerateCart = () =>
  apiClient.get("/api/v1/carts/re-generate-cart");
