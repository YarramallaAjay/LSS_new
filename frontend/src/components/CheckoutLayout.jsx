import { Outlet } from "react-router-dom";
import CheckoutHeader from "./CheckoutHeader.jsx";
import { CartProvider } from "../context/CartContext.jsx";

// Cart/Checkout still need CartProvider (quantity updates, totals, etc.)
// but intentionally skip the full site nav, search bar, marquee, MiniCart
// popover, and Footer that StorefrontLayout renders — keeping the customer
// focused on completing their purchase instead of browsing away.
export default function CheckoutLayout() {
  return (
    <CartProvider>
      <CheckoutHeader />
      <main>
        <Outlet />
      </main>
    </CartProvider>
  );
}
