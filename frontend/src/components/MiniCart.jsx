import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function MiniCart() {
  const { items, total, miniCartOpen, closeMiniCart, updateItem } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={closeMiniCart}
        className={`fixed inset-0 bg-black/45 z-[9998] transition-opacity duration-300 ${
          miniCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed top-0 right-0 w-96 max-w-[90vw] h-full bg-white z-[9999] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          miniCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h4 className="font-bold text-lg m-0">Your Cart</h4>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeMiniCart}
            className="text-2xl text-gray-500 hover:text-black transition-colors leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 mt-20">Cart is empty</p>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}_${item.priceId}`}
                className="flex gap-4 mb-3 pb-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors"
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  width={70}
                  height={70}
                  className="w-[70px] h-[70px] rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-sm mb-1 truncate">{item.productName}</h5>
                  <p className="text-orange-500 font-medium text-sm my-1">
                    ₹ {item.price}
                    {item.priceLabel && (
                      <span className="text-gray-400 font-normal ml-1">· {item.priceLabel}</span>
                    )}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateItem(item.productId, item.priceId, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <span className="font-bold text-base min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateItem(item.productId, item.priceId, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold text-sm mt-2 text-gray-700">
                    Subtotal: ₹ {item.subtotal}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex flex-col gap-3">
          {items.length > 0 && (
            <div className="flex items-center justify-between text-base font-bold text-gray-800 px-1">
              <span>Order Total</span>
              <span className="text-orange-500">₹ {total ?? 0}</span>
            </div>
          )}
          <Link
            to="/cart"
            onClick={closeMiniCart}
            className="block w-full text-center border-2 border-brand-red text-brand-red hover:bg-red-50 font-semibold py-2.5 rounded-xl no-underline transition-colors"
          >
            View Full Cart
          </Link>
          {items.length > 0 && (
            <Link
              to="/checkout"
              onClick={closeMiniCart}
              className="block w-full text-center bg-brand-red hover:bg-red-700 text-white font-semibold py-3 rounded-xl no-underline transition-colors"
            >
              Proceed to Checkout →
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
