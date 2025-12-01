import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ProfilelNav from "../components/ProfileNav";


const ProfileLayout = () => {
  return (
    <>
    <Header />
    <div className="container">
        <div className="profile">
            <ProfilelNav />
            <Outlet />
        </div>
    </div>
    <Footer /> 
    </>

  );
};

export default ProfileLayout;