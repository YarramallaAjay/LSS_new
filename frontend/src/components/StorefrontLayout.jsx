import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import MiniCart from "./MiniCart.jsx";
import { CartProvider } from "../context/CartContext.jsx";

// CartProvider is scoped to storefront routes only — admin routes never
// trigger the cart API call.
export default function StorefrontLayout() {
  return (
    <CartProvider>
      <Header />
      <MiniCart />
      <main>
        <Outlet />
      </main>
      <Footer />
    </CartProvider>
  );
}
