import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCheckoutSummary, lookupPincode, placeOrder, verifyPayment } from "../api/checkout.js";
import { useCart } from "../context/CartContext.jsx";

const INDIAN_STATES = [
  "Andhra Pradesh", "Telangana", "Tamil Nadu", "Karnataka", "Kerala",
  "Maharashtra", "Gujarat", "Rajasthan", "Madhya Pradesh", "Goa",
  "Chhattisgarh", "Delhi", "Other",
];

export default function Checkout() {
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [agreedToShipping, setAgreedToShipping] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    getCheckoutSummary()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (form.pincode.length !== 6) return;

    const timer = setTimeout(() => {
      lookupPincode(form.pincode).then((data) => {
        if (data.city || data.state) {
          setForm((f) => ({ ...f, city: data.city, state: data.state || f.state }));
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [form.pincode]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    try {
      const orderResponse = await placeOrder(form);

      if (!orderResponse.success) {
        alert(orderResponse.message || "Could not place order");
        setSubmitting(false);
        return;
      }

      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: "INR",
        name: "Lalitha Surya Sweets",
        description: "Order Payment",
        order_id: orderResponse.razorpayOrderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#d32f2f" },
        handler: async (response) => {
          try {
            await verifyPayment({
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              orderId: orderResponse.orderId,
            });
            await refreshCart();
            navigate(`/order-success/${orderResponse.orderId}`);
          } catch (err) {
            navigate("/payment-failed");
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      };

      if (!window.Razorpay) {
        alert("Payment SDK failed to load. Please check your connection and try again.");
        setSubmitting(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        alert("Payment Failed: " + response.error.description);
        setSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || "Could not place order");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="page-loading">Loading checkout...</p>;
  }

  if (!summary || summary.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/" className="shop-btn">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <h3>Delivery Details</h3>

            <label>Full Name</label>
            <input type="text" required value={form.name} onChange={handleChange("name")} />

            <label>Mobile Number</label>
            <input type="text" required value={form.phone} onChange={handleChange("phone")} />

            <label>Email</label>
            <input type="email" required value={form.email} onChange={handleChange("email")} />

            <label>House No, Building, Road, Area *</label>
            <textarea required value={form.address} onChange={handleChange("address")}></textarea>

            <label>Pincode *</label>
            <input
              type="text"
              maxLength={6}
              required
              value={form.pincode}
              onChange={handleChange("pincode")}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label>City *</label>
                <input type="text" value={form.city} onChange={handleChange("city")} />
              </div>
              <div style={{ flex: 1 }}>
                <label>State *</label>
                <select required value={form.state} onChange={handleChange("state")}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="col">
            <h3>Order Summary</h3>

            <div className="order-summary">
              {summary.items.map((item) => (
                <div className="order-item" key={`${item.productId}_${item.priceId}`}>
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span>₹{item.subtotal}</span>
                </div>
              ))}

              <hr />

              <div className="order-item">
                <span>Subtotal</span>
                <span>₹{summary.subtotal}</span>
              </div>
              <div className="order-item">
                <span>Handling</span>
                <span>₹{summary.handling}</span>
              </div>
              <div className="order-item">
                <span>Delivery</span>
                <span>{summary.delivery == 0 ? "0" : `₹${summary.delivery}`}</span>
              </div>

              <div className="total">Total: ₹{summary.total}</div>
            </div>
          </div>
        </div>

        <br />

        <div
          style={{
            marginTop: 25,
            padding: 20,
            background: "#fff3cd",
            borderRadius: 8,
            border: "1px solid #ffeeba",
          }}
        >
          <h4>📦 Shipping Policy</h4>

          <div>
            <label>
              <input
                type="checkbox"
                checked={agreedToShipping}
                onChange={(e) => setAgreedToShipping(e.target.checked)}
              />{" "}
              I have read and agree to the shipping policy
            </label>
          </div>

          {agreedToShipping && (
            <div style={{ marginTop: 15 }}>
              <p>
                <b>Shipping Charges:</b>
              </p>
              <p style={{ marginLeft: 10 }}>
                Delivery charges depend on destination pincode, package weight, and courier
                partner.
              </p>
              <ul style={{ marginLeft: 20 }}>
                <li>✅ An estimated shipping cost will be shown at checkout</li>
                <li>✅ Final courier charges will be confirmed before dispatch</li>
              </ul>
              <p>📞 For exact courier charges, contact us on WhatsApp after placing your order.</p>
            </div>
          )}
        </div>

        <button type="submit" disabled={!agreedToShipping || submitting}>
          {submitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
