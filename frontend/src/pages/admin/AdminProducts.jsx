import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getAdminProducts, toggleProduct } from "../../api/admin.js";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    getAdminProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (id) => {
    setBusyId(id);
    try {
      const updated = await toggleProduct(id);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch {
      alert("Failed to update product availability.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete product.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="page-loading">Loading products...</p>;
  if (error) return <p className="page-error">{error}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Products</h2>
        <Link to="/admin/products/add" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Pricing</th>
            <th>Featured</th>
            <th>Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} style={{ width: 48, height: 48, objectFit: "cover" }} />
                ) : (
                  "-"
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>
                {p.prices?.map((price) => (
                  <div key={price.id || price.label}>
                    {price.label}: ₹{price.price}
                  </div>
                ))}
              </td>
              <td>{p.featured ? "Yes" : "No"}</td>
              <td>{p.enabled ? "Yes" : "No"}</td>
              <td style={{ display: "flex", gap: "6px" }}>
                <Link to={`/admin/products/edit/${p.id}`} className="btn btn-sm">
                  Edit
                </Link>
                <button type="button" className="btn btn-sm" disabled={busyId === p.id} onClick={() => handleToggle(p.id)}>
                  {p.enabled ? "Disable" : "Enable"}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  disabled={busyId === p.id}
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                No products yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
