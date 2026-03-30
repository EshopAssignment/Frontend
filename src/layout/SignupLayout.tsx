import { consumeRedirectToast } from "@/lib/redirectToast";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import AuthHeader from "@/components/AuthHeader";



const SignupLayout = () => {
  useEffect(() => {
    consumeRedirectToast();
  }, []);
  return(
  <>
      <AuthHeader />
    <div className="container">
            <Outlet />
    </div>
    <Footer />
  </>

  );
};

export default SignupLayout;