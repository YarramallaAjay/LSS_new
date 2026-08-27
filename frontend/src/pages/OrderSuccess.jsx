import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, invoiceDownloadUrl } from "../api/checkout.js";
import { API_BASE_URL } from "../api/client.js";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getOrder(id, { signal: controller.signal })
      .then(setOrder)
      .catch((err) => { if (err?.code !== "ERR_CANCELED") setOrder(null); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <p className="max-w-xl mx-auto my-20 text-center text-gray-500">Loading order...</p>;
  }

  if (!order) {
    return <p className="max-w-xl mx-auto my-20 text-center text-red-600">Order not found.</p>;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-green-600 mb-3">Order Confirmed!</h1>
      <p className="text-gray-600 text-lg mb-8">
        Thank you for choosing <strong>Lalitha Surya Sweets</strong>. Your delicious treats are
        being prepared! 🍬
      </p>

      <div className="bg-white rounded-2xl shadow-sm p-6 text-left mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Order ID</span>
          <span className="font-bold">#{order.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Customer</span>
          <span>{order.customer?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Total Amount</span>
          <span className="font-bold">₹ {order.totalAmount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Status</span>
          <span className="font-bold text-green-600">{order.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 font-medium">Order Date</span>
          <span>{order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}</span>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-4">📞 For any queries, contact us on WhatsApp.</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://wa.me/919133777448"
          target="_blank"
          rel="noreferrer"
          className="flex-1 text-center bg-[#25D366] hover:bg-green-600 text-white font-semibold py-3 rounded-xl no-underline transition-colors"
        >
          Chat on WhatsApp
        </a>
        <Link
          to="/"
          className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl no-underline transition-colors"
        >
          Continue Shopping
        </Link>
        <a
          href={invoiceDownloadUrl(order.id, API_BASE_URL)}
          target="_blank"
          rel="noreferrer"
          className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl no-underline transition-colors"
        >
          Download Invoice
        </a>
      </div>
    </div>
  );
}
