import { NavLink } from "react-router-dom";

const AuthHeader = () => {
  return (
    <header className="auth-header">
        <div className="logo">
        <NavLink to="/">
            <img src="/src/images/logo.png" alt="Logga" />
        </NavLink>
        </div>   
    </header>
  );
};

export default AuthHeader;