import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_SLIDES = [
  {
    id: 1,
    image: "/images/banner.jpg",
    tag: "Pure & Natural",
    headline: ["Pure Ghee.", "Pure Love."],
    subline: "Handcrafted sweets with no artificial essence — just tradition.",
    cta: { label: "Shop Sweets", to: "/category/Sweet" },
    ctaAlt: { label: "View Menu", to: "/category/Special" },
  },
  {
    id: 2,
    image: "/images/banner.jpg",
    tag: "Fresh Daily",
    headline: ["Hot Snacks,", "Fresh Daily"],
    subline: "Crispy, spicy, and made fresh every morning in our kitchen.",
    cta: { label: "Explore Snacks", to: "/category/Hot" },
    ctaAlt: { label: "See All", to: "/" },
  },
  {
    id: 3,
    image: "/images/banner.jpg",
    tag: "Special Occasions",
    headline: ["Specials for", "Every Occasion"],
    subline: "Weddings, festivals, gifting — we've got you covered.",
    cta: { label: "See Specials", to: "/category/Special" },
    ctaAlt: { label: "Order Now", to: "/category/Sweet" },
  },
];

export default function HeroCarousel({ slides = DEFAULT_SLIDES }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const intervalRef = useRef(null);
  const count = slides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 4000);
  }, [next]);

  useEffect(() => {
    if (!paused) startInterval();
    else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [paused, startInterval]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(360px, 55vw, 600px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Static background image — never moves ── */}
      <img
        src="/images/banner.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Directional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

      {/* ── Foreground content strip — only this translates ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 md:px-14 w-full">
                <div className="max-w-lg">

                  {/* Category / mood tag pill */}
                  <span className="inline-flex items-center gap-1.5 bg-amber-400 text-black text-[11px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full mb-5 shadow-lg">
                    <span className="w-1.5 h-1.5 bg-black/40 rounded-full" />
                    {slide.tag}
                  </span>

                  {/* Multi-line headline */}
                  <h1
                    className="text-white font-black leading-[1.1] mb-3 drop-shadow-2xl"
                    style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
                  >
                    {slide.headline.map((line, i) => (
                      <span key={i} className="block">{line}</span>
                    ))}
                  </h1>

                  {/* Accent divider */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-12 h-[3px] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full block" />
                    <span className="w-2.5 h-[3px] bg-orange-400/50 rounded-full block" />
                    <span className="w-1 h-[3px] bg-orange-400/25 rounded-full block" />
                  </div>

                  {/* Subline */}
                  <p className="text-white/80 text-base md:text-lg mb-7 leading-relaxed">
                    {slide.subline}
                  </p>

                  {/* Dual CTA row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href={slide.cta.to}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-extrabold px-6 py-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-orange-400/50 no-underline text-sm"
                    >
                      {slide.cta.label}
                      <span aria-hidden="true">→</span>
                    </a>
                    <a
                      href={slide.ctaAlt.to}
                      className="inline-flex items-center border-2 border-white/50 hover:border-white hover:bg-white/10 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 no-underline text-sm backdrop-blur-sm"
                    >
                      {slide.ctaAlt.label}
                    </a>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Slide counter — top right ── */}
      {count > 1 && (
        <div className="absolute top-5 right-14 flex items-baseline gap-1 z-10 select-none">
          <span className="text-white font-black text-xl tracking-tight">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="text-white/40 text-sm">/ {String(count).padStart(2, "0")}</span>
        </div>
      )}

      {/* ── Vertical pill dots — right edge ── */}
      {count > 1 && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-2 h-8 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* ── Arrow pair — bottom left ── */}
      {count > 1 && (
        <div className="absolute bottom-5 left-6 md:left-14 flex gap-2 z-10">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="w-9 h-9 rounded-full border border-white/40 hover:border-white/80 hover:bg-white/15 text-white flex items-center justify-center transition-all backdrop-blur-sm text-xl leading-none"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white flex items-center justify-center transition-all backdrop-blur-sm text-xl leading-none"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
