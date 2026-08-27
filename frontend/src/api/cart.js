import api from "./client";

export const getCart = () => api.get("/cart").then((r) => r.data);

export const addToCart = (productId, priceId, quantity = 1) =>
  api
    .post(
      "/cart/add",
      new URLSearchParams({ productId, priceId, quantity })
    )
    .then((r) => r.data);

export const updateCartItem = (productId, priceId, quantity) =>
  api
    .post(
      "/cart/update",
      new URLSearchParams({ productId, priceId, quantity })
    )
    .then((r) => r.data);

export const removeCartItem = (productId, priceId) =>
  api
    .post("/cart/remove", new URLSearchParams({ productId, priceId }))
    .then((r) => r.data);

export const clearCart = () => api.post("/cart/clear").then((r) => r.data);
