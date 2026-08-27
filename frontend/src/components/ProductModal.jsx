import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [selectedPriceId, setSelectedPriceId] = useState(product.prices?.[0]?.id ?? null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Body scroll lock + ESC close
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedPriceId) {
      showToast("Please select a weight", "warning");
      return;
    }

    setAdding(true);
    try {
      await addItem(product.id, selectedPriceId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch {
      showToast("Failed to add item to cart", "error");
    } finally {
      setAdding(false);
    }
  };

  const selectedPrice = product.prices?.find((p) => p.id === selectedPriceId);
  const hasPrices = product.prices?.length > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full grid md:grid-cols-2 overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Image panel ── */}
        <div className="relative bg-amber-50 min-h-[240px] flex items-stretch">

          {/* Skeleton: while loading, or placeholder on error */}
          {(!imgLoaded || imgError) && (
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${
                imgError ? "bg-amber-50" : "bg-gray-200 animate-skeleton"
              }`}
            >
              {imgError && (
                <>
                  <span className="text-6xl select-none" aria-hidden="true">🍬</span>
                  <p className="text-amber-700/50 text-xs font-medium tracking-wide uppercase">
                    Image unavailable
                  </p>
                  {/* Decorative skeleton lines to fill space */}
                  <div className="flex flex-col items-center gap-2 mt-1">
                    <span className="w-20 h-2 bg-amber-200 rounded-full animate-skeleton block" />
                    <span className="w-14 h-2 bg-amber-200 rounded-full animate-skeleton block" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Real image */}
          {!imgError && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover max-h-[480px] min-h-[240px] transition-opacity duration-300 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          )}

          {product.featured && (
            <span className="absolute top-3 left-3 z-10 bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              Featured
            </span>
          )}
        </div>

        {/* ── Detail panel ── */}
        <div className="p-8 flex flex-col gap-4 overflow-y-auto max-h-[480px]">

          {/* Close */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="self-end text-gray-400 hover:text-black text-2xl leading-none transition-colors -mt-2 -mr-2"
          >
            ✕
          </button>

          {/* Category pill — skeleton if missing */}
          {product.category ? (
            <span className="self-start bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
              {product.category}
            </span>
          ) : (
            <span className="self-start h-6 w-20 rounded-full bg-gray-200 animate-skeleton inline-block" />
          )}

          {/* Name — skeleton if missing */}
          {product.name ? (
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
          ) : (
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded-full animate-skeleton w-4/5" />
              <div className="h-6 bg-gray-200 rounded-full animate-skeleton w-3/5" />
            </div>
          )}

          {product.description && (
            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
          )}

          {/* Price selector — skeleton pills if no prices */}
          {hasPrices ? (
            <div className="flex flex-wrap gap-2">
              {product.prices.map((pp) => (
                <button
                  key={pp.id}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedPriceId(pp.id); }}
                  className={`px-4 py-1.5 rounded-full text-sm border font-medium transition-colors cursor-pointer ${
                    selectedPriceId === pp.id
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white border-orange-400 hover:bg-orange-50"
                  }`}
                >
                  {pp.label} — ₹{pp.price}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              <span className="h-8 w-24 rounded-full bg-gray-200 animate-skeleton inline-block" />
              <span className="h-8 w-24 rounded-full bg-gray-200 animate-skeleton inline-block" />
              <span className="h-8 w-24 rounded-full bg-gray-200 animate-skeleton inline-block" />
            </div>
          )}

          {/* Selected price display — skeleton if no prices */}
          {hasPrices ? (
            selectedPrice && (
              <p className="text-2xl font-bold text-orange-500">₹ {selectedPrice.price}</p>
            )
          ) : (
            <div className="h-8 w-28 bg-gray-200 rounded-full animate-skeleton" />
          )}

          <form onSubmit={handleAdd} className="mt-auto">
            <button
              type="submit"
              disabled={adding || !hasPrices}
              className={`w-full py-3 rounded-full font-semibold text-white transition-all duration-200 ${
                added
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-orange-400 to-orange-600 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(255,120,0,0.35)]"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {added
                ? "✔ Added to Cart"
                : adding
                ? "Adding..."
                : hasPrices
                ? "Add to Cart"
                : "Currently Unavailable"}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
