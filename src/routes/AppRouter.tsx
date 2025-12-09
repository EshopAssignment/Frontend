import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/User/HomePage";
import OrderConfirmationPage from "../pages/User/OrderConfirmationPage";
import DetailsPage from "../pages/User/DetailsPage";
import ProductPage from "../pages/User/ProductPage";
import AdminDash from "../pages/Admin/AdminDash";
import AdminLayout from "../layout/AdminLayout";
import MainLayout from "../layout/MainLayout";
import AdminProducts from "../pages/Admin/AdminProducts";
import MyProfile from "../pages/Profile/MyProfile";
import ProfileLayout from "../layout/ProfileLayout";
import Orders from "../pages/Profile/Orders";
import Help from "../pages/Profile/Help";
import Gdpr from "../pages/Profile/Gdpr";
import SignupLayout from "../layout/SignupLayout";

import SignUpForm from "../pages/SignUp/SignUpForm";
import SignInForm from "../pages/SignUp/SignInForm";
import Auth from "../pages/SignUp/Auth";
import CompanyForm from "../pages/SignUp/CompanyForm";
import AdminOrders from "../pages/Admin/AdminOrders";
import RequireAdmin from "./RequireAdmin";
import RequireAuth from "./RequiresAuth";




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
        <Route element={<RequireAdmin />}> 
          <Route index element={<AdminDash />} /> 
          <Route path="adminproducts" element={<AdminProducts />} />
          <Route path="admin-orders" element={<AdminOrders />} />
        </Route> 
      </Route>

      <Route path="/profile" element={<ProfileLayout />}>
        <Route element={<RequireAuth/>}>
          <Route index element={<MyProfile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="help" element={<Help />} />
          <Route path="gdpr" element={<Gdpr />} />
        </Route>
      </Route>

      <Route path="/auth" element={<SignupLayout />}>
        <Route index element={<Auth />} />
        <Route path="login" element={<SignInForm />} />
        <Route path="register" element={<SignUpForm />} />
        <Route path="company" element={<CompanyForm />} />
      </Route>
    </Routes>

    
  );
};

export default AppRouter;
