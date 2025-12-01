import { NavLink } from "react-router-dom";

const ProfilelNav = () => {
  return (
    <nav className="profile-nav">
        <NavLink end to="" className="btn">Profil</NavLink>
        <NavLink to="orders" className="btn">Mina ordrar</NavLink>
        <NavLink to="help" className="btn">Hjälp och kontakt</NavLink>
        <NavLink to="gdpr" className="btn">GDPR</NavLink>
    </nav>
  );
};

export default ProfilelNav;