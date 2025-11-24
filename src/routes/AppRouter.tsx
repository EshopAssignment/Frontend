import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ComponentPage from "../pages/ComponentPage";
import OrderConfirmationPage from "../pages/OrderConfirmationPage";
import DetailsPage from "../pages/DetailsPage";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<ComponentPage />} />
      <Route path="/product/:id" element={<DetailsPage />} /> 
      <Route path="/order/thank-you/:orderNumber" element={<OrderConfirmationPage/>} />
    </Routes>
  );
};

export default AppRouter;
