import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, invoiceDownloadUrl } from "../api/checkout.js";
import { API_BASE_URL } from "../api/client.js";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="page-loading">Loading order...</p>;
  }

  if (!order) {
    return <p className="page-error">Order not found.</p>;
  }

  return (
    <div className="success-wrapper">
      <div className="success-icon">🎉</div>

      <h1 style={{ color: "#28a745", marginBottom: 10 }}>Order Confirmed!</h1>

      <p style={{ fontSize: 18, color: "#555" }}>
        Thank you for choosing <b>Lalitha Surya Sweets</b>. Your delicious treats are being
        prepared! 🍬
      </p>

      <div className="order-details">
        <p>
          <b>Order ID:</b> #{order.id}
        </p>
        <p>
          <b>Customer:</b> {order.customer?.name}
        </p>
        <p>
          <b>Total Amount:</b> ₹ {order.totalAmount}
        </p>
        <p>
          <b>Status:</b> <span style={{ color: "#28a745", fontWeight: "bold" }}>{order.status}</span>
        </p>
        <p>
          <b>Order Date:</b> {order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        <p style={{ color: "#666" }}>📞 For any queries, contact us on WhatsApp.</p>
        <a
          href="https://wa.me/919133777448"
          target="_blank"
          rel="noreferrer"
          className="btn-custom"
          style={{ background: "#25D366", color: "white" }}
        >
          Chat on WhatsApp
        </a>
      </div>

      <div style={{ marginTop: 30 }}>
        <Link to="/" className="btn-custom btn-primary">
          Continue Shopping
        </Link>

        <a
          href={invoiceDownloadUrl(order.id, API_BASE_URL)}
          className="btn-custom btn-secondary"
          target="_blank"
          rel="noreferrer"
        >
          Download Invoice
        </a>
      </div>
    </div>
  );
}
