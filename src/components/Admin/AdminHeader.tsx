import { useLogout } from "@/hooks/Auth/useAuth";
import { NavLink, useNavigate } from "react-router-dom";

const AdminHeader = () => {
      const logout = useLogout();
      const nav = useNavigate();
    
      const handleLogout = async () => {
        try {
          await logout.mutateAsync();
          nav("/", {replace: true});
        } catch{}
      }
  return (
    <header className="admin-header">            
      <div className="admin-logo">
        <NavLink to="/">
          <img src="./src/images/logo.png" alt="Logga" />
        </NavLink>
      </div>



    <nav className="admin-nav-group">
        <NavLink to="/" className="admin-nav">Back to start</NavLink>
        <NavLink to="/admin" className="admin-nav" end>Dashbord</NavLink>
        <NavLink to="admin-request" className="admin-nav" end>Quotes</NavLink>
        <NavLink to="admin-products" className="admin-nav">Products</NavLink>
        <NavLink to="admin-orders" className="admin-nav">Orders</NavLink>
        <NavLink to="admin-fulfillment" className="admin-nav">Fulfillemnts</NavLink>
        <button
        type="button"
        onClick={handleLogout}
        className="btn btn-primary"
        >
        Logga ut
        </button>
    </nav>


    </header>
  );
};

export default AdminHeader;