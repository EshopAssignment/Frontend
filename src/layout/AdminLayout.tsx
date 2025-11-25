import { Outlet } from "react-router-dom";


const AdminLayout = () => {
  return (
    <>
      <header>Någon typ av header för admins</header>
        <Outlet />
    </>
  );
};

export default AdminLayout;