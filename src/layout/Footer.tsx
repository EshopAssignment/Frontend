const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Sidfot
      </h2>

      <div className="footer-inner">
        <section className="footer-top" aria-label="Footerinnehåll">
          <div className="footer-brand">
            <a href="/" className="footer-logo" aria-label="Pallshoppen startsida">
              <span className="footer-logo-mark" aria-hidden="true">
                PS
              </span>
              <span className="footer-logo-text">Pallshoppen</span>
            </a>

            <p className="footer-tagline">
              Enkelt. Smidigt. På pall.
            </p>

            <p className="footer-description">
              Pallshoppen är en modern e-handel för pallbaserade produkter och smart logistik.
            </p>
          </div>

          <section
            className="footer-sponsors"
            aria-labelledby="footer-sponsors-heading"
          >
            <h3 id="footer-sponsors-heading" className="footer-title">
              Partners & sponsorer
            </h3>

            <div
              className="footer-sponsor-track"
              role="list"
              aria-label="Plats för sponsorlogotyper"
            >
              <a href="#" className="footer-sponsor-card" role="listitem" aria-label="Sponsor 1">
                Sponsor 1
              </a>
              <a href="#" className="footer-sponsor-card" role="listitem" aria-label="Sponsor 2">
                Sponsor 2
              </a>
              <a href="#" className="footer-sponsor-card" role="listitem" aria-label="Sponsor 3">
                Sponsor 3
              </a>
              <a href="#" className="footer-sponsor-card" role="listitem" aria-label="Sponsor 4">
                Sponsor 4
              </a>
            </div>
          </section>
        </section>

        <div className="footer-nav-grid">
          <nav className="footer-nav" aria-labelledby="footer-shop-heading">
            <h3 id="footer-shop-heading" className="footer-title">
              Butiken
            </h3>
            <ul className="footer-list">
              <li><a href="#">Produkter</a></li>
              <li><a href="#">Kategorier</a></li>
              <li><a href="#">Nyheter</a></li>
              <li><a href="#">Kampanjer</a></li>
            </ul>
          </nav>

          <nav className="footer-nav" aria-labelledby="footer-support-heading">
            <h3 id="footer-support-heading" className="footer-title">
              Kundservice
            </h3>
            <ul className="footer-list">
              <li><a href="#">Kontakta oss</a></li>
              <li><a href="#">Vanliga frågor</a></li>
              <li><a href="#">Frakt & leverans</a></li>
              <li><a href="#">Returer & reklamation</a></li>
            </ul>
          </nav>

          <nav className="footer-nav" aria-labelledby="footer-accessibility-heading">
            <h3 id="footer-accessibility-heading" className="footer-title">
              Tillgänglighet
            </h3>
            <ul className="footer-list">
              <li><a href="#">Tillgänglighetsredogörelse</a></li>
              <li><a href="#">Hjälpmedelsstöd</a></li>
              <li><a href="#">Rapportera brister</a></li>
              <li><a href="#">Webbplatskarta</a></li>
            </ul>
          </nav>

          <nav className="footer-nav" aria-labelledby="footer-legal-heading">
            <h3 id="footer-legal-heading" className="footer-title">
              Juridik
            </h3>
            <ul className="footer-list">
              <li><a href="#">Köpvillkor</a></li>
              <li><a href="#">Integritetspolicy</a></li>
              <li><a href="#">Cookies</a></li>
              <li><a href="#">Om oss</a></li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Pallshoppen. Alla rättigheter förbehållna.
          </p>

          <ul className="footer-meta" aria-label="Sekundära länkar">
            <li><a href="#">Tillgänglighet</a></li>
            <li><a href="#">Kundservice</a></li>
            <li><a href="#">Integritet</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;