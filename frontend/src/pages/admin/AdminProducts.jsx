import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getAdminProducts, toggleProduct } from "../../api/admin.js";
import { useToast } from "../../context/ToastContext.jsx";

const thClass = "text-left px-4 py-3 font-semibold text-gray-600 text-sm";
const tdClass = "px-4 py-3 text-sm align-middle";

export default function AdminProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getAdminProducts({ signal: controller.signal })
      .then(setProducts)
      .catch((err) => { if (err?.code !== "ERR_CANCELED") setError("Failed to load products."); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const load = () => {
    setLoading(true);
    getAdminProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  };

  const handleToggle = async (id) => {
    setBusyId(id);
    try {
      const updated = await toggleProduct(id);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch {
      showToast("Failed to update product availability.", "error");
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
      showToast("Product deleted", "success");
    } catch {
      showToast("Failed to delete product.", "error");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-center text-gray-500 py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold">Products</h2>
        <Link
          to="/admin/products/add"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg text-sm no-underline transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className={thClass}>Image</th>
              <th className={thClass}>Name</th>
              <th className={thClass}>Category</th>
              <th className={thClass}>Pricing</th>
              <th className={thClass}>Featured</th>
              <th className={thClass}>Enabled</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className={tdClass}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      N/A
                    </div>
                  )}
                </td>
                <td className={`${tdClass} font-medium`}>{p.name}</td>
                <td className={tdClass}>{p.category}</td>
                <td className={tdClass}>
                  <div className="space-y-0.5">
                    {p.prices?.map((price) => (
                      <div key={price.id || price.label} className="text-xs text-gray-600">
                        {price.label}: ₹{price.price}
                      </div>
                    ))}
                  </div>
                </td>
                <td className={tdClass}>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.featured ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.featured ? "Yes" : "No"}
                  </span>
                </td>
                <td className={tdClass}>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.enabled ? "Yes" : "No"}
                  </span>
                </td>
                <td className={tdClass}>
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      to={`/admin/products/edit/${p.id}`}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg no-underline transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      onClick={() => handleToggle(p.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        p.enabled
                          ? "bg-orange-50 hover:bg-orange-100 text-orange-700"
                          : "bg-green-50 hover:bg-green-100 text-green-700"
                      }`}
                    >
                      {p.enabled ? "Disable" : "Enable"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">No products yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
