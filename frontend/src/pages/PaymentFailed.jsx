import { Link } from "react-router-dom";

export default function PaymentFailed() {
  return (
    <div className="success-wrapper">
      <div className="success-icon" style={{ color: "#dc3545" }}>
        ❌
      </div>
      <h1 style={{ color: "#dc3545" }}>Payment Failed</h1>
      <p>Something went wrong while processing your payment. Your order has not been confirmed.</p>
      <div style={{ marginTop: 20 }}>
        <Link to="/cart" className="btn-custom btn-primary">
          Back to Cart
        </Link>
        <Link to="/" className="btn-custom btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
