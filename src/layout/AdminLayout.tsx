import { Link, Outlet } from "react-router-dom";


const AdminLayout = () => {
  return (
    <>
      <header>            
        <Link className="btn" to="/">
              Back to start
          </Link></header>
        <Outlet />
    </>
  );
};

export default AdminLayout;