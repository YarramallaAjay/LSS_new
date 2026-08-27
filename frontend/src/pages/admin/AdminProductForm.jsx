import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getAdminProduct, updateProduct } from "../../api/admin.js";
import { useToast } from "../../context/ToastContext.jsx";

const emptyPrice = () => ({ label: "", price: "" });

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "", category: "", description: "", imageUrl: "",
    pricingType: "WEIGHT", enabled: true, featured: false,
  });
  const [prices, setPrices] = useState([emptyPrice()]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    const controller = new AbortController();
    getAdminProduct(id, { signal: controller.signal })
      .then((p) => {
        setForm({
          name: p.name || "", category: p.category || "", description: p.description || "",
          imageUrl: p.imageUrl || "", pricingType: p.pricingType || "WEIGHT",
          enabled: p.enabled, featured: p.featured,
        });
        setPrices(p.prices?.length ? p.prices.map((pr) => ({ label: pr.label, price: pr.price })) : [emptyPrice()]);
      })
      .catch(() => setError("Failed to load product."))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id, isEdit]);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const updatePriceRow = (index, field, value) =>
    setPrices((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  const addPriceRow = () => setPrices((prev) => [...prev, emptyPrice()]);
  const removePriceRow = (index) => setPrices((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSaving(true);

    const payload = {
      ...form,
      id: isEdit ? Number(id) : undefined,
      prices: prices
        .filter((row) => row.label.trim() && row.price !== "")
        .map((row) => ({ label: row.label, price: Number(row.price) })),
    };

    try {
      if (isEdit) { await updateProduct(id, payload); } else { await createProduct(payload); }
      showToast(isEdit ? "Product saved" : "Product created", "success");
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
      setFieldErrors(err.response?.data?.errors || {});
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500 py-10">Loading product...</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-6">{isEdit ? "Edit Product" : "Add Product"}</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div>
          <label className={labelClass} htmlFor="name">Name</label>
          <input id="name" type="text" required className={inputClass} value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          {fieldErrors.name && <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="category">Category</label>
          <input id="category" type="text" required className={inputClass} value={form.category} onChange={(e) => updateField("category", e.target.value)} />
        </div>

        <div>
          <label className={labelClass} htmlFor="desc">Description</label>
          <textarea id="desc" rows={3} className={inputClass} value={form.description} onChange={(e) => updateField("description", e.target.value)} />
        </div>

        <div>
          <label className={labelClass} htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" type="text" className={inputClass} value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} />
        </div>

        <div>
          <label className={labelClass} htmlFor="pricingType">Pricing Type</label>
          <select id="pricingType" className={inputClass} value={form.pricingType} onChange={(e) => updateField("pricingType", e.target.value)}>
            <option value="WEIGHT">By Weight</option>
            <option value="PIECE">By Piece</option>
            <option value="FIXED">Fixed</option>
          </select>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" checked={form.enabled} onChange={(e) => updateField("enabled", e.target.checked)} />
            <span className="text-sm font-medium text-gray-700">Enabled</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>

        {/* Prices */}
        <div>
          <h3 className="font-bold text-sm text-gray-700 mb-3">Prices</h3>
          <div className="space-y-2">
            {prices.map((row, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. 500g)"
                  value={row.label}
                  onChange={(e) => updatePriceRow(index, "label", e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 transition"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={row.price}
                  onChange={(e) => updatePriceRow(index, "price", e.target.value)}
                  className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => removePriceRow(index)}
                  className="text-red-500 hover:text-red-700 font-bold px-2 transition-colors"
                  aria-label="Remove price row"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addPriceRow}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            + Add Price
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
