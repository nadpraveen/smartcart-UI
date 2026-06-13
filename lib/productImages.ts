export const getProductImage = (category: string) => {
  const map: Record<string, string> = {
    grains: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
    vegetables: "https://images.unsplash.com/photo-1542838132-92c53300491e",
    fruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf",
    dairy: "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    protein: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
    snacks: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087",
  };

  return map[category] || "https://via.placeholder.com/150";
};