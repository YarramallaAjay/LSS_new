import api from "./client";

export const trackOrder = (id) => api.get(`/orders/${id}/track`).then((r) => r.data);

export const cancelOrder = (id, reason) =>
  api.post(`/orders/${id}/cancel`, { reason }).then((r) => r.data);
