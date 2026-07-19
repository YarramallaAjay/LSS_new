import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getAdminProduct, updateProduct } from "../../api/admin.js";

const emptyPrice = () => ({ label: "", price: "" });

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    imageUrl: "",
    pricingType: "WEIGHT",
    enabled: true,
    featured: false,
  });
  const [prices, setPrices] = useState([emptyPrice()]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    getAdminProduct(id)
      .then((p) => {
        setForm({
          name: p.name || "",
          category: p.category || "",
          description: p.description || "",
          imageUrl: p.imageUrl || "",
          pricingType: p.pricingType || "WEIGHT",
          enabled: p.enabled,
          featured: p.featured,
        });
        setPrices(p.prices?.length ? p.prices.map((pr) => ({ label: pr.label, price: pr.price })) : [emptyPrice()]);
      })
      .catch(() => setError("Failed to load product."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updatePriceRow = (index, field, value) => {
    setPrices((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

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
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
      setFieldErrors(err.response?.data?.errors || {});
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="page-loading">Loading product...</p>;

  return (
    <div>
      <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>

      {error && <p className="page-error">{error}</p>}

      <form onSubmit={handleSubmit} className="product-form">
        <label>
          Name
          <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </label>

        <label>
          Category
          <input
            type="text"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} />
        </label>

        <label>
          Image URL
          <input type="text" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} />
        </label>

        <label>
          Pricing Type
          <select value={form.pricingType} onChange={(e) => updateField("pricingType", e.target.value)}>
            <option value="WEIGHT">By Weight</option>
            <option value="PIECE">By Piece</option>
            <option value="FIXED">Fixed</option>
          </select>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => updateField("enabled", e.target.checked)}
          />
          Enabled
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => updateField("featured", e.target.checked)}
          />
          Featured
        </label>

        <h3>Prices</h3>
        {prices.map((row, index) => (
          <div key={index} className="price-row" style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
            <input
              type="text"
              placeholder="Label (e.g. 500g)"
              value={row.label}
              onChange={(e) => updatePriceRow(index, "label", e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={row.price}
              onChange={(e) => updatePriceRow(index, "price", e.target.value)}
            />
            <button type="button" className="btn btn-sm btn-danger" onClick={() => removePriceRow(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-sm" onClick={addPriceRow}>
          + Add Price
        </button>

        <div style={{ marginTop: "16px" }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
