import { Outlet } from "react-router-dom";



const SignupLayout = () => {
  return (
  <>
    <div className="container">
            <Outlet />
    </div>
  </>

  );
};

export default SignupLayout;