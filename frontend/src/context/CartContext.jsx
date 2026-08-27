import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as cartApi from "../api/cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  const applyCart = (data) => {
    setItems(data.items || []);
    setTotal(data.total || 0);
    setCount(data.count ?? (data.items ? data.items.length : 0));
  };

  const refreshCart = useCallback(async () => {
    try {
      const data = await cartApi.getCart();
      applyCart(data);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cart is only fetched once on storefront mount (CartProvider lives in
  // StorefrontLayout, not at app root, so admin routes never trigger this).
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId, priceId, quantity = 1) => {
    const data = await cartApi.addToCart(productId, priceId, quantity);
    applyCart(data);
    setMiniCartOpen(true);
  };

  const updateItem = async (productId, priceId, quantity) => {
    const data = await cartApi.updateCartItem(productId, priceId, quantity);
    applyCart(data);
  };

  const removeItem = async (productId, priceId) => {
    const data = await cartApi.removeCartItem(productId, priceId);
    applyCart(data);
  };

  const clear = async () => {
    const data = await cartApi.clearCart();
    applyCart(data);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        count,
        loading,
        miniCartOpen,
        openMiniCart: () => setMiniCartOpen(true),
        closeMiniCart: () => setMiniCartOpen(false),
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
