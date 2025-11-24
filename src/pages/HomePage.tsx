import { Link } from "react-router-dom";

const HomePage = () => {


  return (
    <section>
      <div className="container">
        <h1>PALLSHOPPEN!</h1>
        <button className="btn">
          <Link to="/product">Se produkter</Link>
        </button>
      </div>
    </section>
  );
};

export default HomePage;
