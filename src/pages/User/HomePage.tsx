import HomePageSlide from "@/components/Swipers/HomePageSlide";
import { Link } from "react-router-dom";


export default function HomePage() {
return (
  <section>
    <div className="home">
        <div className="home-cta container">
          <h1>Pallar, spån och annat du inte visste att du behövde</h1>
          <Link to="/products" className="btn cta-btn">Till alla produkter</Link>
        </div>
        
        <HomePageSlide />

    </div>
  </section>
  );
}
