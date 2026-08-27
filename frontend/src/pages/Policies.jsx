const sections = [
  { id: "refund", label: "Refund Policy" },
  { id: "shipping", label: "Shipping Policy" },
  { id: "terms", label: "Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "shelf", label: "Shelf Life Policy" },
];

export default function Policies() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center bg-[#f4b400] text-black font-bold text-2xl py-6 rounded-2xl mb-8">
        Store Policies
      </div>

      {/* Policy nav */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="bg-white border border-gray-200 hover:border-orange-400 hover:text-orange-600 text-gray-700 font-medium px-4 py-2 rounded-full text-sm transition-colors no-underline shadow-sm"
          >
            {s.label}
          </a>
        ))}
      </div>

      <div className="space-y-8">
        {/* Refund */}
        <section id="refund" className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">🍬 Refund Policy</h2>
          <p className="text-gray-700 mb-3">
            At Lalitha Surya Sweets, we take utmost care to deliver fresh and high-quality products.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm mb-3">
            <li>Refunds are not applicable once the order is prepared and dispatched.</li>
            <li>Refunds or replacements will be considered only if:</li>
            <li>The wrong product is delivered</li>
            <li>The product is damaged during transit</li>
          </ul>
          <p className="text-gray-700 text-sm mb-2">
            Customers must report the issue within <strong>24 hours of delivery</strong> with clear
            photos/videos.
          </p>
          <p className="text-gray-700 text-sm">
            Approved refunds will be processed within <strong>5–7 working days</strong>.
          </p>
        </section>

        {/* Shipping */}
        <section id="shipping" className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">🚚 Shipping Policy</h2>
          <p className="text-gray-700 text-sm mb-3">
            Delivery charges depend on destination pincode, package weight, and courier partner.
          </p>
          <ul className="list-none space-y-1 text-gray-700 text-sm mb-3">
            <li>✅ An estimated shipping cost will be shown at checkout.</li>
            <li>✅ Final courier charges will be confirmed before dispatch.</li>
            <li>📞 Contact us on WhatsApp after placing your order for exact charges.</li>
          </ul>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            <li>Orders are processed within 24–48 hours after confirmation.</li>
            <li>Delivery timelines depend on the destination and courier partner.</li>
            <li>Delays may occur due to weather, festivals, or courier delays.</li>
          </ul>
        </section>

        {/* Terms */}
        <section id="terms" className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">📜 Terms &amp; Conditions</h2>
          <p className="text-gray-700 text-sm mb-3">
            By using our website and placing an order, you agree to the following:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm mb-3">
            <li>All product images are for representation purposes only.</li>
            <li>Prices may change without prior notice.</li>
            <li>Orders cannot be modified or cancelled once confirmed.</li>
            <li>We reserve the right to cancel orders under unavoidable circumstances.</li>
          </ul>
          <p className="text-gray-700 text-sm">All disputes are subject to local jurisdiction.</p>
        </section>

        {/* Privacy */}
        <section id="privacy" className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">🔐 Privacy Policy</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            <li>Customer information is collected only for order processing.</li>
            <li>Name, phone number, and address are kept strictly confidential.</li>
            <li>We do not sell or share customer data with third parties.</li>
            <li>Payments are processed through secure gateways.</li>
          </ul>
        </section>

        {/* Shelf Life */}
        <section id="shelf" className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">📜 Shelf Life &amp; Consumption Policy</h2>
          <p className="text-gray-700 text-sm mb-4">
            All products are freshly prepared using traditional methods and high-quality ingredients,
            without artificial preservatives.
          </p>

          <h3 className="font-bold text-base mb-3">Product Shelf Life Guidelines:</h3>

          <div className="space-y-4">
            {[
              { icon: "🥛", title: "Milk-Based Sweets", desc: "Junnu, Kova, Milk Kalakand, Pala Kova", life: "2–3 days", storage: "Refrigeration mandatory" },
              { icon: "🧈🍯", title: "Ghee & Jaggery Sweets", desc: "Bellam Wheat Halwa, Bellam Arisalu, Sunnundalu", life: "5–7 days", storage: "Cool dry place" },
              { icon: "🥜", title: "Dry Fruit & Sugar Sweets", desc: "", life: "10–15 days", storage: "Airtight container" },
              { icon: "🌶️", title: "Hot Snacks", desc: "", life: "15–20 days", storage: "Airtight container" },
              { icon: "🥭", title: "Pickles", desc: "", life: "3–6 months", storage: "Use dry spoon" },
            ].map(({ icon, title, desc, life, storage }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-semibold text-sm mb-1">{icon} {title}</h5>
                {desc && <p className="text-gray-500 text-xs mb-1">{desc}</p>}
                <p className="text-xs text-gray-600">Shelf Life: <strong>{life}</strong> | Storage: {storage}</p>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-base mt-6 mb-3">Disclaimer:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            <li>Shelf life may vary depending on weather, transportation, and handling.</li>
            <li>Lalitha Surya Sweets is not responsible for spoilage due to improper storage.</li>
            <li>Product appearance may vary slightly due to traditional preparation methods.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
