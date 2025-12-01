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

      <Route path="/profile" element={<ProfileLayout />}>
        <Route index element={<MyProfile />} />
        <Route path="orders" element={<Orders />} />
        <Route path="help" element={<Help />} />
        <Route path="gdpr" element={<Gdpr />} />
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
