import { Link } from "react-router-dom";

const AdminBtn = () => {
    return (
        <Link to={"/admin"} className="admin-btn" aria-label="Admin">
            <i className="fa-solid fa-users-gear"></i>    
        </Link>
    );
};
export default AdminBtn;