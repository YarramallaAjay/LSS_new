import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function MiniCart() {
  const { items, miniCartOpen, closeMiniCart, updateItem } = useCart();

  return (
    <>
      <div
        className={`mini-cart-overlay ${miniCartOpen ? "active" : ""}`}
        onClick={closeMiniCart}
      ></div>

      <div className={`mini-cart ${miniCartOpen ? "active" : ""}`}>
        <div className="mini-cart-header">
          <h4>Your Cart</h4>
          <button type="button" className="mini-close-btn" onClick={closeMiniCart}>
            ✕
          </button>
        </div>

        <div className="mini-cart-body">
          {items.length === 0 ? (
            <p className="empty-cart-text">Cart is empty</p>
          ) : (
            items.map((item) => (
              <div className="mini-cart-item" key={`${item.productId}_${item.priceId}`}>
                <img
                  src={item.imageUrl}
                  width="70"
                  height="70"
                  style={{ borderRadius: "10px", objectFit: "cover" }}
                  alt={item.productName}
                />

                <div className="mini-cart-info">
                  <h5>{item.productName}</h5>
                  <p className="mini-price">₹ {item.price}</p>

                  <div className="mini-qty-box">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() =>
                        updateItem(item.productId, item.priceId, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span className="qty-number">{item.quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() =>
                        updateItem(item.productId, item.priceId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="mini-subtotal">Total: ₹ {item.subtotal}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mini-cart-footer">
          <Link to="/cart" className="view-cart-btn" onClick={closeMiniCart}>
            View Full Cart
          </Link>
        </div>
      </div>
    </>
  );
}
