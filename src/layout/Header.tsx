import { Link } from "react-router-dom";
import TopBarGroup from "../components/Buttons/TopBarGroup";
import Searchbar from "../components/Searchbar";

const Header = () => {
  return (
    <header className="header">

      <div className="container">

        <div className="top-bar">

          <div className="logo">
            <Link to="/products">
              <img src="./src/images/pallet-logo-placeholder.png" alt="Logga" />
            </Link>
          </div>
          
          <Searchbar />

          <TopBarGroup />


        </div>

      </div>

    </header>
  );
};

export default Header;