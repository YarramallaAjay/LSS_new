import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-6 mt-16 relative">
      {/* Grid */}
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-8">
        <div>
          <h4 className="font-bold text-[#ff6f00] mb-4">About Us</h4>
          <p className="leading-relaxed text-sm text-gray-300">
            Established in 2006, <strong className="text-white">Lalitha Surya Sweets</strong> has
            been a trusted name for authentic Indian sweets and traditional snacks.
          </p>
          <p className="leading-relaxed text-sm text-gray-300 mt-2">
            With over 18 years of experience, we use premium ingredients, pure ghee, and
            traditional recipes.
          </p>
        </div>

        <div id="contact">
          <h4 className="font-bold text-[#ff6f00] mb-4">Contact</h4>
          <p className="text-sm text-gray-300 mb-1">📞 +91 9133777448</p>
          <p className="text-sm text-gray-300 mb-1">📞 +91 9441752361</p>
          <p className="text-sm text-gray-300 mb-1">✉️ lalithasuryasweets1@gmail.com</p>
          <p className="text-sm text-gray-300">⏰ Mon - Sun: 9:00 AM - 10:00 PM</p>
        </div>

        <div>
          <h4 className="font-bold text-[#ff6f00] mb-4">Policies</h4>
          {[
            ["#refund", "Refund Policy"],
            ["#shipping", "Shipping Policy"],
            ["#terms", "Terms & Conditions"],
            ["#privacy", "Privacy Policy"],
            ["#shelf", "Shelf Life & Consumption Policy"],
          ].map(([hash, label]) => (
            <Link
              key={hash}
              to={`/policies${hash}`}
              className="block text-sm text-gray-300 hover:text-white hover:underline mb-2"
            >
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 className="font-bold text-[#ff6f00] mb-4">Location</h4>
          <p className="text-sm text-gray-300 mb-1">🏬 Lalitha Surya Sweets</p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Near Ganganamma temple center,
            <br />
            Jangareddigudem,
            <br />
            Andhra Pradesh 534447
          </p>
          <a
            href="https://maps.app.goo.gl/aydzAxEUTrdk5MWk7"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-2 text-sm text-gray-300 hover:text-white hover:underline"
          >
            📍 View on Google Maps
          </a>
        </div>
      </div>

      {/* Social icons */}
      <div className="flex justify-center gap-5 mt-6 mb-4">
        {[
          {
            href: "https://www.facebook.com/share/1GQaQ1Av4s/",
            icon: "fab fa-facebook-f",
            hoverBg: "#1877f2",
            hoverShadow: "#1877f2",
            label: "Facebook",
          },
          {
            href: "https://wa.me/919133777448",
            icon: "fab fa-whatsapp",
            hoverBg: "#25D366",
            hoverShadow: "#25D366",
            label: "WhatsApp",
          },
          {
            href: "https://www.instagram.com/lalitha_surya_sweets?igsh=ZzU0azZnMW1lNzBi&utm_source=qr",
            icon: "fab fa-instagram",
            hoverBg: "#E1306C",
            hoverShadow: "#E1306C",
            label: "Instagram",
          },
        ].map(({ href, icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="w-11 h-11 rounded-full bg-[#1e1e1e] flex items-center justify-center text-xl text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <i className={icon}></i>
          </a>
        ))}
      </div>

      <hr className="border-none h-px bg-[#222] mx-5 mt-4" />

      <p className="text-center text-sm text-gray-400 mt-4">
        © Lalitha Surya Sweets. All Rights Reserved.
      </p>

      {/* WhatsApp float button */}
      <a
        href="https://wa.me/919133777448"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center text-2xl shadow-lg z-50 hover:scale-110 hover:shadow-[0_0_15px_#25D366] transition-all duration-300"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </footer>
  );
}
