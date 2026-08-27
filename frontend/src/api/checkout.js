import api from "./client";

export const getCheckoutSummary = (config) =>
  api.get("/checkout", config).then((r) => r.data);

export const lookupPincode = (pincode) =>
  api.get(`/checkout/pincode/${pincode}`).then((r) => r.data);

export const placeOrder = (payload) =>
  api.post("/checkout/place-order", payload).then((r) => r.data);

export const verifyPayment = (payload) =>
  api.post("/checkout/payment-verify", payload).then((r) => r.data);

export const getOrder = (id, config) =>
  api.get(`/checkout/order/${id}`, config).then((r) => r.data);

export const invoiceDownloadUrl = (id, apiBaseUrl) =>
  `${apiBaseUrl}/api/checkout/invoice/${id}`;
