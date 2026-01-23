import { consumeRedirectToast } from "@/lib/redirectToast";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";



const SignupLayout = () => {
  useEffect(() => {
    consumeRedirectToast();
  }, []);
  return(
  <>
    <div className="container">
            <Outlet />
    </div>
  </>

  );
};

export default SignupLayout;