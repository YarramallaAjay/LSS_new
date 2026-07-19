import api from "./client";

export const adminLogin = (username, password) =>
  api.post("/admin/auth/login", { username, password }).then((r) => r.data);

export const getDashboardStats = () => api.get("/admin/dashboard").then((r) => r.data);

export const getAdminOrders = (params) =>
  api.get("/admin/orders", { params }).then((r) => r.data);

export const getAdminOrder = (id) => api.get(`/admin/orders/${id}`).then((r) => r.data);

export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data);

export const getAdminProducts = () => api.get("/admin/products").then((r) => r.data);

export const getAdminProduct = (id) => api.get(`/admin/products/${id}`).then((r) => r.data);

export const createProduct = (payload) =>
  api.post("/admin/products", payload).then((r) => r.data);

export const updateProduct = (id, payload) =>
  api.put(`/admin/products/${id}`, payload).then((r) => r.data);

export const toggleProduct = (id) =>
  api.post(`/admin/products/${id}/toggle`).then((r) => r.data);

export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);

export const getAdminCustomers = () => api.get("/admin/customers").then((r) => r.data);
