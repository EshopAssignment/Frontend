import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ComponentPage from "../pages/ComponentPage";
import OrderConfirmationPage from "../pages/OrderConfirmationPage";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<ComponentPage />} />
      <Route path="/order/thank-you/:orderNumber" element={<OrderConfirmationPage/>} />
    </Routes>
  );
};

export default AppRouter;
