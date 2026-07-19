import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, total, loading, updateItem, removeItem, clear } = useCart();

  if (loading) {
    return <p className="page-loading">Loading your cart...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>🛒 Your Cart is Empty</h2>
        <p>Looks like you haven't added any sweets yet.</p>
        <Link to="/" className="shop-btn">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: 20 }}>🛒 Your Cart</h2>

      <div className="cart-container">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={`${item.productId}_${item.priceId}`}>
              <img src={item.imageUrl} className="cart-img" alt={item.productName} />

              <div className="cart-info">
                <h4>{item.productName}</h4>
                <p>{item.priceLabel}</p>
                <p>₹ {item.price}</p>

                <div className="cart-qty">
                  <button
                    type="button"
                    onClick={() => updateItem(item.productId, item.priceId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateItem(item.productId, item.priceId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <p className="subtotal">Subtotal: ₹ {item.subtotal}</p>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.productId, item.priceId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h4>Total</h4>
          <h3>₹ {total}</h3>

          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout →
          </Link>

          <div className="cart-buttons">
            <Link to="/" className="c-btn">
              ⬅ Continue Shopping
            </Link>
            <button className="c-btn" onClick={clear}>
              🗑 Clear Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
