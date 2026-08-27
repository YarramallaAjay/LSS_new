import { Link } from "react-router-dom";

// Shared minimal header: brand only, plus an optional badge (e.g. "Secure
// Checkout"). Used by pages that intentionally skip the full site nav.
export default function MinimalHeader({ badge }) {
  return (
    <header className="bg-[#f4b400] shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-black no-underline shrink-0">
          Lalitha Surya Sweets
        </Link>
        {badge && (
          <span className="text-sm font-semibold text-white flex items-center gap-1">
            {badge}
          </span>
        )}
      </div>
    </header>
  );
}
