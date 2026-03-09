import { useLogout } from "@/hooks/Auth/useAuth";
import { Link, Outlet, useNavigate } from "react-router-dom";


const AdminLayout = () => {
  const logout = useLogout();
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      nav("/", {replace: true});
    } catch{}
  }
  return (
    <>
      <header>            
        <Link className="btn" to="/">
              Back to start
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-primary"
          >
            Logga ut
          </button>
          </header>
        <Outlet />
    </>
  );
};

export default AdminLayout;