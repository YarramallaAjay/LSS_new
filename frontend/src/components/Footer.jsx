import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h4>About Us</h4>
          <p>
            Established in 2006, <strong>Lalitha Surya Sweets</strong> has been a trusted name
            for authentic Indian sweets and traditional snacks.
          </p>
          <p>
            With over 18 years of experience in crafting sweets the traditional way, we use
            premium ingredients, pure ghee, and traditional recipes.
          </p>
        </div>

        <div id="contact">
          <h4>Contact</h4>
          <p>📞 +91 9133777448</p>
          <p>📞 +91 9441752361</p>
          <p>✉️ surya1akula@gmail.com</p>
          <p>⏰ Mon - Sun: 9:00 AM - 10:00 PM</p>
        </div>

        <div>
          <h4>Policies</h4>
          <Link to="/policies#refund">Refund Policy</Link>
          <br />
          <br />
          <Link to="/policies#shipping">Shipping Policy</Link>
          <br />
          <br />
          <Link to="/policies#terms">Terms &amp; Conditions</Link>
          <br />
          <br />
          <Link to="/policies#privacy">Privacy Policy</Link>
          <br />
          <br />
          <Link to="/policies#shelf">Shelf Life &amp; Consumption Policy</Link>
        </div>

        <div>
          <h4>Location</h4>
          <p>🏬 Lalitha Surya Sweets</p>
          <p>
            Near Ganganamma temple center,
            <br />
            Jangareddigudem,
            <br />
            Andhra Pradesh 534447
          </p>
          <p>
            <a target="_blank" rel="noreferrer" href="https://maps.app.goo.gl/aydzAxEUTrdk5MWk7">
              📍 View on Google Maps
            </a>
          </p>
        </div>
      </div>

      <div className="footer-social">
        <a
          href="https://www.facebook.com/share/1GQaQ1Av4s/"
          target="_blank"
          rel="noreferrer"
          className="social-icon facebook"
        >
          <i className="fab fa-facebook-f"></i>
        </a>

        <a
          href="https://wa.me/919133777448"
          target="_blank"
          rel="noreferrer"
          className="social-icon whatsapp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>

        <a
          href="https://www.instagram.com/lalitha_surya_sweets?igsh=ZzU0azZnMW1lNzBi&utm_source=qr"
          target="_blank"
          rel="noreferrer"
          className="social-icon instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>
      </div>

      <hr className="footer-line" />

      <p className="copyright">© Lalitha Surya Sweets. All Rights Reserved.</p>

      <a href="https://wa.me/919133777448" className="whatsapp-float" target="_blank" rel="noreferrer">
        <i className="fab fa-whatsapp"></i>
      </a>
    </footer>
  );
}
