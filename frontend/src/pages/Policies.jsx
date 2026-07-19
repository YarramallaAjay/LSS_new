export default function Policies() {
  return (
    <div className="policies-page">
      <div className="policy-header">Store Policies</div>

      <div className="policy-nav">
        <a href="#refund">Refund Policy</a>
        <a href="#shipping">Shipping Policy</a>
        <a href="#terms">Terms &amp; Conditions</a>
        <a href="#privacy">Privacy Policy</a>
        <a href="#shelf">Shelf Life Policy</a>
      </div>

      <div className="policy-container">
        <div className="policy-section" id="refund">
          <h2>🍬 Refund Policy</h2>
          <p>At Lalitha Surya Sweets, we take atmost care to deliver fresh and high-quality products.</p>
          <ul>
            <li>Refunds are not applicable once the order is prepared and dispatched.</li>
            <li>Refunds or replacements will be considered only if:</li>
            <li>The wrong product is delivered</li>
            <li>The product is damaged during transit</li>
          </ul>
          <p>
            Customers must report the issue within <b>24 hours of delivery</b> with clear
            photos/videos of the product and packaging.
          </p>
          <p>Approved refunds will be processed within <b>5–7 working days</b>.</p>
        </div>

        <div className="policy-section" id="shipping">
          <h2>🚚 Shipping Policy</h2>
          <p>Delivery charges depend on destination pincode, package weight, and courier partner.</p>
          <ul>
            <li>✅ An estimated shipping cost will be shown at checkout.</li>
            <li>✅ Final courier charges will be confirmed before dispatch.</li>
            <li>📞 For exact courier charges, contact us on WhatsApp after placing your order.</li>
          </ul>
          <ul>
            <li>Orders are processed within 24–48 hours after confirmation.</li>
            <li>Delivery timelines depends on the destination and courier partner.</li>
            <li>Shipping charges(if any) will be shown during checkout.</li>
          </ul>
          <p>Delays may occur due to weather, festivals, or courier partner delays.</p>
          <p>
            We ensure proper packaging, but once shipped, delivery timelines are handled by the
            courier service.
          </p>
        </div>

        <div className="policy-section" id="terms">
          <h2>📜 Terms &amp; Conditions</h2>
          <p>By using our website and placing an order, you agree to the following:</p>
          <ul>
            <li>All Product images are for representation purposes only.</li>
            <li>Prices may change without prior notice.</li>
            <li>Orders cannot be modified or cancelled once confirmed.</li>
            <li>We reserve the right to cancel orders under unavoidable circumstances.</li>
          </ul>
          <p>All disputes are subject to local jurisdiction.</p>
        </div>

        <div className="policy-section" id="privacy">
          <h2>🔐 Privacy Policy</h2>
          <ul>
            <li>Customer information is collected only for order processing.</li>
            <li>Name, phone number, and address are kept strictly confidential.</li>
            <li>We do not sell or share customer data with third parties.</li>
            <li>Payments are processed through secure gateways.</li>
          </ul>
        </div>

        <div className="policy-section" id="shelf">
          <h2>📜 Shelf Life &amp; Consumption Policy</h2>
          <p>
            At Lalitha Surya Sweets, all products are freshly prepared using traditional methods
            and high-quality ingredients, without the use of artificial preservatives. Due to the
            natural and perishable nature of our products, customers are advised to strictly
            follow the consumption and storage guidelines mentioned below.
          </p>

          <h3>Product Shelf Life Guidelines:</h3>

          <h5>🥛 Milk-Based Sweets</h5>
          <p>Junnu, Kova, Milk Kalakand, Pala Kova</p>
          <ul>
            <li>Shelf Life: 2–3 days</li>
            <li>Storage: Refrigeration mandatory</li>
          </ul>

          <h5>🧈🍯 Ghee &amp; Jaggery Sweets</h5>
          <p>Bellam Wheat Halwa, Bellam Arisalu, Sunnundalu</p>
          <ul>
            <li>Shelf Life: 5–7 days</li>
            <li>Storage: Cool dry place</li>
          </ul>

          <h5>🥜 Dry Fruit &amp; Sugar Sweets</h5>
          <ul>
            <li>Shelf Life: 10–15 days</li>
            <li>Storage: Airtight container</li>
          </ul>

          <h5>🌶️ Hot Snacks</h5>
          <ul>
            <li>Shelf Life: 15–20 days</li>
            <li>Storage: Airtight container</li>
          </ul>

          <h5>🥭 Pickles</h5>
          <ul>
            <li>Shelf Life: 3–6 months</li>
            <li>Storage: Use dry spoon</li>
          </ul>

          <h3>Storage &amp; Handling Responsibility:</h3>
          <p>Customers are solely responsible for:</p>
          <ul>
            <li>Proper storage of products after delivery</li>
            <li>Following the recommended consumption period</li>
            <li>Avoiding exposure to heat, moisture, and contamination</li>
          </ul>
          <p>Failure to follow storage instructions may result in spoilage or quality degradation.</p>

          <h3>Disclaimer:</h3>
          <ul>
            <li>
              Shelf life may vary depending on weather conditions, transportation time, handling,
              and storage environment.
            </li>
            <li>
              Lalitha Surya Sweets shall not be held responsible for any deterioration in quality
              or spoilage occurring due to improper storage or delayed consumption after delivery.
            </li>
            <li>Product appearance and taste may vary slightly due to traditional preparation methods.</li>
          </ul>

          <h3>Acceptance of Policy:</h3>
          <p>
            By placing an order on our website, the customer acknowledges and agrees to this
            Shelf Life &amp; Consumption Policy and understands the perishable nature of the
            products.
          </p>
          <p>Customers are responsible for proper storage after delivery.</p>
        </div>
      </div>
    </div>
  );
}
