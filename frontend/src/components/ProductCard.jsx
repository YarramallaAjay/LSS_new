import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [selectedPriceId, setSelectedPriceId] = useState(
    product.prices?.[0]?.id ?? null
  );
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!selectedPriceId) {
      alert("Please select weight");
      return;
    }

    setAdding(true);
    try {
      await addItem(product.id, selectedPriceId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch (err) {
      alert("Failed to add item");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card" data-id={product.id} data-name={product.name}>
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>

      <div className="weights">
        {product.prices?.map((pp) => (
          <button
            type="button"
            key={pp.id}
            className={`weight-btn ${selectedPriceId === pp.id ? "active" : ""}`}
            onClick={() => setSelectedPriceId(pp.id)}
          >
            <span>{pp.label}</span> - ₹<span>{pp.price}</span>
          </button>
        ))}
      </div>

      <form className="add-form" onSubmit={handleAdd}>
        <button type="submit" className="add-btn" disabled={adding}>
          {added ? "✔ Added" : "Add to Cart"}
        </button>
      </form>
    </div>
  );
}
