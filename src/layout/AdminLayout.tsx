import AdminHeader from "@/components/Admin/AdminHeader";
import { Outlet } from "react-router-dom";


const AdminLayout = () => {

  return (
    <>
      <AdminHeader />
      <Outlet />
    </>
  );
};

export default AdminLayout;