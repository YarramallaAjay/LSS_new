import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, total, loading, updateItem, removeItem, clear } = useCart();

  if (loading) {
    return <p className="max-w-xl mx-auto my-20 text-center text-gray-500">Loading your cart...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">🛒 Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any sweets yet.</p>
        <Link
          to="/"
          className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all no-underline"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">🛒 Your Cart</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={`${item.productId}_${item.priceId}`}
              className="bg-white rounded-2xl shadow-sm p-4 flex gap-4"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-24 h-24 rounded-xl object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base mb-1">{item.productName}</h4>
                <p className="text-sm text-gray-500 mb-1">{item.priceLabel}</p>
                <p className="text-orange-500 font-medium mb-2">₹ {item.price}</p>

                <div className="flex items-center gap-3 mb-2">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => updateItem(item.productId, item.priceId, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="font-bold min-w-[24px] text-center">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateItem(item.productId, item.priceId, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm font-semibold text-gray-700">Subtotal: ₹ {item.subtotal}</p>

                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.priceId)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h4 className="font-bold text-lg mb-2">Order Total</h4>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">₹ {total}</h3>

            <Link
              to="/checkout"
              className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl no-underline transition-colors mb-4"
            >
              Proceed to Checkout →
            </Link>

            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className="block text-center text-gray-600 hover:text-gray-900 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors no-underline"
              >
                ⬅ Continue Shopping
              </Link>
              <button
                type="button"
                onClick={clear}
                className="text-center text-red-500 hover:text-red-700 font-medium py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                🗑 Clear Cart
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
