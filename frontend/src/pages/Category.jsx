import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { getProductsByCategory } from "../api/products.js";

export default function Category() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductsByCategory(category)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <section className="product-section">
      <h2>{category} Products</h2>

      {loading ? (
        <p className="page-loading">Loading...</p>
      ) : products.length === 0 ? (
        <p className="page-loading">No products found in this category yet.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
