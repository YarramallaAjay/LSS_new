import { Outlet } from "react-router-dom";
import MinimalHeader from "./MinimalHeader.jsx";

// For pages customers reach via a direct link (e.g. Track Order from an
// email/WhatsApp notification) rather than by browsing the shop. No cart
// context needed here, and no full nav/footer — just the brand header.
export default function MinimalLayout() {
  return (
    <>
      <MinimalHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
}
