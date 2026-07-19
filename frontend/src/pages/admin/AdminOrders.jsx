import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders, updateOrderStatus } from "../../api/admin.js";

const STATUS_OPTIONS = [
  "NEW",
  "PENDING",
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ keyword: "", status: "", fromDate: "", toDate: "" });
  const [pendingStatus, setPendingStatus] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(
    (targetPage = 0) => {
      setLoading(true);
      setError(null);

      const params = { page: targetPage, size: 20 };
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.status) params.status = filters.status;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;

      getAdminOrders(params)
        .then((data) => {
          setOrders(data.orders);
          setPage(data.page);
          setTotalPages(data.totalPages);
        })
        .catch(() => setError("Failed to load orders."))
        .finally(() => setLoading(false));
    },
    [filters]
  );

  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    load(0);
  };

  const handleStatusChange = (orderId, value) => {
    setPendingStatus((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleStatusUpdate = async (order) => {
    const newStatus = pendingStatus[order.id];
    if (!newStatus) return;

    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatus(order.id, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setPendingStatus((prev) => ({ ...prev, [order.id]: "" }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h2>Orders</h2>

      <form onSubmit={handleFilterSubmit} className="filters-form">
        <input
          type="text"
          placeholder="Search name, phone, order id..."
          value={filters.keyword}
          onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
        />
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
        />
        <button type="submit" className="btn btn-primary">
          Filter
        </button>
      </form>

      {error && <p className="page-error">{error}</p>}

      {loading ? (
        <p className="page-loading">Loading orders...</p>
      ) : (
        <>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Address</th>
                <th>State</th>
                <th>Ordered At</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Cancel Reason</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/admin/orders/${order.id}`}>#{order.id}</Link>
                  </td>
                  <td>
                    {order.customerNameSnapshot}
                    <br />
                    {order.customerPhoneSnapshot}
                  </td>
                  <td>{order.address}</td>
                  <td>{order.state}</td>
                  <td>{order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span className="status-badge">{order.status}</span>
                  </td>
                  <td>
                    {order.nextAllowedStatuses?.length > 0 ? (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <select
                          value={pendingStatus[order.id] || ""}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="">Change to...</option>
                          {order.nextAllowedStatuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn btn-sm"
                          disabled={!pendingStatus[order.id] || updatingId === order.id}
                          onClick={() => handleStatusUpdate(order)}
                        >
                          {updatingId === order.id ? "..." : "Update"}
                        </button>
                      </div>
                    ) : (
                      <em>Final</em>
                    )}
                  </td>
                  <td>{order.cancelReason || "-"}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button type="button" disabled={page <= 0} onClick={() => load(page - 1)}>
              ← Prev
            </button>
            <span>
              Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
            </span>
            <button type="button" disabled={page + 1 >= totalPages} onClick={() => load(page + 1)}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
