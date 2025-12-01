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
      <div className="home-img-container">
        <img className="home-img" src="src\images\Home.jpg" alt="" />
        <img className="home-img" src="src\images\Home2.jpg" alt="" />
        <img className="home-img" src="src\images\Home3.jpg" alt="" />
        <img  className="home-img"src="src\images\Home4.jpg" alt="" />
        <img className="home-img" src="src\images\Home5.jpg" alt="" />
        <img className="home-img" src="src\images\Home6.jpg" alt="" />
      </div>
    </section>
  );
};

export default HomePage;
