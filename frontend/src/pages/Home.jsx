import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { getFeatured, getHomeSweets, getHomeHot } from "../api/products.js";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [sweet, setSweet] = useState([]);
  const [hot, setHot] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getFeatured(), getHomeSweets(), getHomeHot()])
      .then(([f, s, h]) => {
        setFeatured(f);
        setSweet(s.slice(0, 15));
        setHot(h.slice(0, 15));
      })
      .catch(() => setError("Could not load products. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <p className="page-error">{error}</p>;
  }

  return (
    <>
      <section className="hero-image">
        <img src="/images/banner.jpg" className="w-100" style={{ maxHeight: 600, objectFit: "cover" }} alt="Lalitha Surya Sweets" />
      </section>

      <section className="brand-message py-5">
        <div className="container text-center">
          <div className="message-card p-5">
            <h2 className="fw-bold mb-3">“Where Sweetness meets perfection”</h2>
            <p className="mb-3">
              At <strong>Lalitha Surya Sweets</strong>, every delicacy tells a story — No
              artificial essence added to any of our sweets.
            </p>
            <h5 className="fw-semibold">You Are What You Eat, So Eat Something Sweet</h5>
          </div>
        </div>
      </section>

      {!loading && (
        <>
          <section id="featured">
            <div className="section-header">
              <h2>Featured Products</h2>
            </div>
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          <section id="sweet">
            <div className="section-header">
              <h2>Traditional Sweets</h2>
              <Link to="/category/Sweet" className="view-all">
                View All →
              </Link>
            </div>
            <div className="product-grid">
              {sweet.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          <section id="making" className="making-section">
            <h2>How Our Specials Are Made</h2>
            <p className="subtitle">Watch our chefs craft magic daily 🍯🔥</p>
            <div className="video-grid">
              <iframe
                width="500"
                height="515"
                src="https://www.youtube.com/embed/T2rvjUjR7hY?si=G1LNMx7mDj2cFHit"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
              <iframe
                width="500"
                height="515"
                src="https://www.youtube.com/embed/_cphhE0Xwjk?si=ifhbPaa2FEstVyKO"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
              <iframe
                width="500"
                height="515"
                src="https://www.youtube.com/embed/RC_N7rgm1TU?si=vYNNa8QqRbkm7OVe"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          <section id="hot">
            <div className="section-header">
              <h2>Hot Snacks</h2>
              <Link to="/category/Hot" className="view-all">
                View All →
              </Link>
            </div>
            <div className="product-grid">
              {hot.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
