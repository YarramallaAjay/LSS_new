import api from "./client";

export const getAllProducts = (config) => api.get("/products", config).then((r) => r.data);

export const getProductsByCategory = (category, config) =>
  api.get(`/products/category/${encodeURIComponent(category)}`, config).then((r) => r.data);

export const getFeatured = (config) => api.get("/home/featured", config).then((r) => r.data);
export const getHomeSweets = (config) => api.get("/home/sweet", config).then((r) => r.data);
export const getHomeHot = (config) => api.get("/home/hot", config).then((r) => r.data);
