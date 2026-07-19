import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import MiniCart from "./MiniCart.jsx";

export default function StorefrontLayout() {
  return (
    <>
      <Header />
      <MiniCart />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
