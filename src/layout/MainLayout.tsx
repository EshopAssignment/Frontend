import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";
import { consumeRedirectToast } from "@/lib/redirectToast";


const MainLayout = () => {
  useEffect(() => {
    consumeRedirectToast();
  }, []);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};


export default MainLayout;