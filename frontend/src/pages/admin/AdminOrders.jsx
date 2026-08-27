import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders, updateOrderStatus } from "../../api/admin.js";
import { useToast } from "../../context/ToastContext.jsx";

const STATUS_OPTIONS = [
  "NEW", "PENDING", "PLACED", "CONFIRMED", "PREPARING",
  "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED",
];

const STATUS_COLORS = {
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  PLACED: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-amber-100 text-amber-700",
  PREPARING: "bg-orange-100 text-orange-700",
  PACKED: "bg-blue-100 text-blue-700",
};

const thClass = "text-left px-4 py-3 font-semibold text-gray-600 text-sm whitespace-nowrap";
const tdClass = "px-4 py-3 text-sm";

export default function AdminOrders() {
  const { showToast } = useToast();
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

  const handleStatusUpdate = async (order) => {
    const newStatus = pendingStatus[order.id];
    if (!newStatus) return;
    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatus(order.id, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setPendingStatus((prev) => ({ ...prev, [order.id]: "" }));
      showToast("Status updated", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update order status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const inputClass =
    "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 transition";

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">Orders</h2>

      {/* Filters */}
      <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm">
        <input
          type="text"
          placeholder="Search name, phone, order id..."
          value={filters.keyword}
          onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
          className={`${inputClass} flex-1 min-w-[160px]`}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className={inputClass}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={filters.fromDate} onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))} className={inputClass} />
        <input type="date" value={filters.toDate} onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))} className={inputClass} />
        <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors">
          Filter
        </button>
      </form>

      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading orders...</p>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={thClass}>Order ID</th>
                  <th className={thClass}>Customer</th>
                  <th className={thClass}>Address</th>
                  <th className={thClass}>State</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Total</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Update</th>
                  <th className={thClass}>Cancel Reason</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className={tdClass}>
                      <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline font-medium">
                        #{order.id}
                      </Link>
                    </td>
                    <td className={tdClass}>
                      <span className="font-medium">{order.customerNameSnapshot}</span>
                      <br />
                      <span className="text-gray-500 text-xs">{order.customerPhoneSnapshot}</span>
                    </td>
                    <td className={`${tdClass} max-w-[150px] truncate`}>{order.address}</td>
                    <td className={tdClass}>{order.state}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}
                    </td>
                    <td className={tdClass}>₹{order.totalAmount}</td>
                    <td className={tdClass}>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className={tdClass}>
                      {order.nextAllowedStatuses?.length > 0 ? (
                        <div className="flex gap-2 items-center">
                          <select
                            value={pendingStatus[order.id] || ""}
                            onChange={(e) => setPendingStatus((p) => ({ ...p, [order.id]: e.target.value }))}
                            className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="">Change to...</option>
                            {order.nextAllowedStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button
                            type="button"
                            disabled={!pendingStatus[order.id] || updatingId === order.id}
                            onClick={() => handleStatusUpdate(order)}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                          >
                            {updatingId === order.id ? "..." : "Update"}
                          </button>
                        </div>
                      ) : (
                        <em className="text-gray-400 text-xs">Final</em>
                      )}
                    </td>
                    <td className={`${tdClass} text-gray-500 max-w-[120px] truncate`}>
                      {order.cancelReason || "-"}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-gray-400">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => load(page - 1)}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() => load(page + 1)}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
