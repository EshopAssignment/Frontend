import { Link } from "react-router-dom";

const HomePage = () => {


  return (
    <section>
      <div className="container">
        <h1>PALLSHOPPEN!</h1>

        <Link to="/products">
          <button className="btn"> Se produkter</button>
        </Link>
        
        <Link to={"/admin"}>
            <button className="btn">Admin </button>
        </Link>

      </div>
    </section>
  );
};

export default HomePage;
