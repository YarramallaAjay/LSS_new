import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { getAllProducts } from "../api/products.js";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Sweets", to: "/category/Sweet" },
  { label: "Hot", to: "/category/Hot" },
  { label: "Specials", to: "/category/Special" },
  { label: "Pickels", to: "/category/Pickel" },
];

export default function Header() {
  const { count, openMiniCart } = useCart();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    getAllProducts()
      .then(setAllProducts)
      .catch(() => setAllProducts([]));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const lower = value.toLowerCase();
    setResults(allProducts.filter((p) => p.name.toLowerCase().includes(lower)));
    setShowResults(true);
  };

  const goToProduct = (product) => {
    setShowResults(false);
    setQuery("");
    navigate(`/category/${encodeURIComponent(product.category)}`);
  };

  return (
    <header className="shadow-sm sticky-top navbar-custom">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light w-100">
          <Link className="navbar-brand fw-bold" to="/">
            Lalitha Surya Sweets
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="mainNav">
            <ul className="navbar-nav gap-3">
              {NAV_LINKS.map((link) => (
                <li className="nav-item" key={link.to}>
                  <Link className="nav-link" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="search-wrapper" ref={searchRef}>
            <input
              type="text"
              placeholder="Search sweets..."
              autoComplete="off"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {showResults && (
              <div className="search-results show" style={{ display: "block" }}>
                {results.length === 0 && <div className="no-result">No sweets found</div>}
                {results.map((product) => (
                  <div
                    key={product.id}
                    className="result-item"
                    onClick={() => goToProduct(product)}
                  >
                    <img src={product.imageUrl} alt={product.name} />
                    <span>{product.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn btn-outline-danger position-relative"
            onClick={openMiniCart}
          >
            🛒 Cart
            {count > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
