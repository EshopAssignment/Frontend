import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/User/HomePage";
import OrderConfirmationPage from "../pages/User/OrderConfirmationPage";
import DetailsPage from "../pages/User/DetailsPage";
import ProductPage from "../pages/User/ProductPage";
import AdminDash from "../pages/Admin/AdminDash";
import AdminLayout from "../layout/AdminLayout";
import MainLayout from "../layout/MainLayout";
import AdminProducts from "../pages/Admin/AdminProducts";



const AppRouter = () => {
  return (

    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="product/:id" element={<DetailsPage />} />
        <Route path="order/thank-you/:orderNumber" element={<OrderConfirmationPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDash />} />
        <Route path="adminproducts" element={<AdminProducts />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
