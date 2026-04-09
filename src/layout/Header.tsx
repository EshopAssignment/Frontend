import { NavLink } from "react-router-dom";
import TopBarGroup from "../components/Buttons/TopBarGroup";
import Searchbar from "../components/Searchbar";

const Header = () => {
  return (
    <header className="header">

      <div className="container">

        <div className="top-bar">

          <div className="logo">
            <NavLink to="/">
              <img src="./src/images/logo.webp" alt="Logga" />
            </NavLink>
          </div>
          
          <Searchbar />

          <TopBarGroup />


        </div>

      </div>

    </header>
  );
};

export default Header;