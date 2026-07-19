import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { trackOrder, cancelOrder } from "../api/orders.js";

const STEPS = ["Placed", "Confirmed", "Preparing", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Wrong address",
  "Delay in delivery",
  "I Changed My Mind",
  "Others",
];

export default function TrackOrder() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    trackOrder(id)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!reason) return;
    setCancelling(true);
    try {
      await cancelOrder(id, reason);
      load();
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <p className="page-loading">Loading order status...</p>;
  }

  if (!data) {
    return <p className="page-error">Order not found.</p>;
  }

  const { order, step, estimatedDelivery, history } = data;
  const canCancel = ["PLACED", "CONFIRMED", "PREPARING"].includes(order.status);

  return (
    <div className="container">
      <h2>📦 Track Your Order</h2>

      {searchParams.get("cancelled") && (
        <div
          style={{
            background: "#dc3545",
            color: "white",
            padding: 10,
            textAlign: "center",
            borderRadius: 6,
            marginBottom: 15,
          }}
        >
          ❌ Order Cancelled Successfully
        </div>
      )}

      <p className="tracking-msg">
        Current Status: <strong>{order.status}</strong>
      </p>

      <div className="order-info">
        <p>
          <b>Order ID:</b> {order.id}
        </p>
        <p>
          <b>Name:</b> {order.customerNameSnapshot}
        </p>
        <p>
          <b>Order Date:</b> {order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}
        </p>
        <p>
          <b>Delivery Charges:</b> ₹ {order.deliveryCharges}
        </p>
        <p>
          <b>Total Amount:</b> ₹ {order.totalAmount}
        </p>
      </div>

      {estimatedDelivery && (
        <p>
          <b>Estimated Delivery:</b> {new Date(estimatedDelivery).toLocaleDateString()}
        </p>
      )}

      <span className={`badge ${order.status.toLowerCase()}`}>{order.status}</span>

      {order.status !== "CANCELLED" && (
        <div className="tracking-wrapper">
          {STEPS.map((label, index) => (
            <div key={label} className={`tracking-step ${step >= index + 1 ? "active" : ""}`}>
              <div className="circle">{index + 1}</div>
              <p>{label}</p>
            </div>
          ))}
        </div>
      )}

      {order.status === "DELIVERED" && (
        <div className="delivered-msg">🎉 Your Order Has Been Delivered Successfully!</div>
      )}

      <h3>Status History</h3>

      <table border="1" width="100%">
        <tbody>
          <tr>
            <th>Status</th>
            <th>Time</th>
          </tr>
          {history.map((h, i) => (
            <tr key={i}>
              <td>{h.status}</td>
              <td>{h.updatedTime ? new Date(h.updatedTime).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {canCancel && (
        <div className="order-actions text-center mt-4">
          <form onSubmit={handleCancel}>
            <label>Cancel Reason</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} required>
              <option value="">Select reason</option>
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-danger" disabled={cancelling}>
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          </form>
        </div>
      )}

      {order.status === "CANCELLED" && (
        <>
          <div
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              color: "#dc3545",
              marginTop: 20,
            }}
          >
            🚫 This Order Was Cancelled
          </div>
          {order.cancelReason && (
            <div style={{ marginTop: 10, color: "#dc3545" }}>
              <b>Reason:</b> {order.cancelReason}
            </div>
          )}
        </>
      )}
    </div>
  );
}
