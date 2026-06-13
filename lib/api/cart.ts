export const generateCart = async (payload: any) => {
  const res = await fetch("https://smartcart-backend-j0jr.onrender.com/cart/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};