import { Link } from "react-router-dom";

export default function PaymentFailed() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">❌</div>
      <h1 className="text-3xl font-bold text-red-600 mb-3">Payment Failed</h1>
      <p className="text-gray-600 mb-8">
        Something went wrong while processing your payment. Your order has not been confirmed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/cart"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl no-underline transition-colors"
        >
          Back to Cart
        </Link>
        <Link
          to="/"
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-xl no-underline transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
