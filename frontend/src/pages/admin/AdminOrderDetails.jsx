import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdminOrder, updateOrderStatus } from "../../api/admin.js";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextStatus, setNextStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    getAdminOrder(id)
      .then(setOrder)
      .catch(() => setError("Failed to load order."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleUpdate = async () => {
    if (!nextStatus) return;
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(id, nextStatus);
      setOrder(updated);
      setNextStatus("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="page-loading">Loading order...</p>;
  if (error) return <p className="page-error">{error}</p>;
  if (!order) return null;

  return (
    <div>
      <p>
        <Link to="/admin/orders">← Back to orders</Link>
      </p>

      <h2>Order #{order.id}</h2>
      <p>
        <span className="status-badge">{order.status}</span>
        {" · "}
        {order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}
      </p>

      <div className="grid">
        <div className="card">
          <h3>Customer</h3>
          <p>
            {order.customerNameSnapshot}
            <br />
            {order.customerPhoneSnapshot}
            <br />
            {order.customer?.email}
          </p>
        </div>
        <div className="card">
          <h3>Delivery Address</h3>
          <p>
            {order.address}
            <br />
            {order.state}
          </p>
        </div>
        <div className="card">
          <h3>Payment</h3>
          <p>
            Status: {order.paymentStatus || "-"}
            <br />
            Payment ID: {order.paymentId || "-"}
          </p>
        </div>
      </div>

      <h3>Items</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Product</th>
            <th>Size / Label</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item) => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>{item.priceLabel}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price}</td>
              <td>₹{item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-totals">
        <p>Subtotal: ₹{order.subtotal}</p>
        <p>Delivery Charges: ₹{order.deliveryCharges}</p>
        <p>Handling Charges: ₹{order.handlingCharges}</p>
        <p>
          <strong>Total: ₹{order.totalAmount}</strong>
        </p>
      </div>

      {order.cancelReason && (
        <p>
          <strong>Cancel Reason:</strong> {order.cancelReason}
        </p>
      )}

      <h3>Update Status</h3>
      {order.nextAllowedStatuses?.length > 0 ? (
        <div style={{ display: "flex", gap: "8px" }}>
          <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
            <option value="">Change to...</option>
            {order.nextAllowedStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-primary" disabled={!nextStatus || updating} onClick={handleUpdate}>
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      ) : (
        <p>
          <em>This order is in a final state and cannot be updated further.</em>
        </p>
      )}
    </div>
  );
}
