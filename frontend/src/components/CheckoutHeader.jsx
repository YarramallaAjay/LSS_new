import MinimalHeader from "./MinimalHeader.jsx";

// Minimal header for Cart/Checkout: just the brand and a trust badge, no
// nav links, search, or marquee. Full site navigation during checkout gives
// customers an easy way to wander off mid-purchase, so it's intentionally
// stripped down here (unlike StorefrontLayout, which keeps the full nav).
export default function CheckoutHeader() {
  return <MinimalHeader badge="🔒 Secure Checkout" />;
}
