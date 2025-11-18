import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ComponentPage from "../pages/ComponentPage";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<ComponentPage />} />
    </Routes>
  );
};

export default AppRouter;
