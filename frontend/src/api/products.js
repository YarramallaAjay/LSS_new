import api from "./client";

export const getAllProducts = () => api.get("/products").then((r) => r.data);

export const getProductsByCategory = (category) =>
  api.get(`/products/category/${encodeURIComponent(category)}`).then((r) => r.data);

export const getFeatured = () => api.get("/home/featured").then((r) => r.data);
export const getHomeSweets = () => api.get("/home/sweet").then((r) => r.data);
export const getHomeHot = () => api.get("/home/hot").then((r) => r.data);
