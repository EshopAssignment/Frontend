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
import Checkout from "@/components/Stripe/Checkout";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import ResetPassword from "@/pages/Auth/ResetPassword";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import AdminCustomRequests from "@/pages/Admin/AdminCustomRequests";




const AppRouter = () => {
  return (

    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="product/:id" element={<DetailsPage />} />
        <Route path="order/thank-you/:orderNumber" element={<OrderConfirmationPage />} />
        <Route path="checkout/:orderNumber" element={<Checkout />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route element={<RequireAdmin />}> 
          <Route index element={<AdminDash />} /> 
          <Route path="admin-products" element={<AdminProducts />} />
          <Route path="admin-orders" element={<AdminOrders />} />
          <Route path="admin-request" element={<AdminCustomRequests />} />
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

      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />}  />
      <Route path="/forgot-password" element={<ForgotPasswordPage />}  />
      
      
      
    </Routes>

    
  );
};

export default AppRouter;
