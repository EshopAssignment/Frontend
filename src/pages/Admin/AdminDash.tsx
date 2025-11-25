import { Link } from "react-router-dom";

const AdminDash = () => {

  return (
    <section>
        <div className="container">
            <div className="admin-group">  

                <Link to="adminproducts" className="btn">Products</Link>

                <Link to={"/admin"} className="btn">Users</Link>

                <Link to={"/admin"} className="btn">Orders</Link>

                <Link  className="btn" to={"/admin"}>Inventory</Link>

                <Link to={"/admin"} className="btn">Health Check</Link>

            </div>
        </div>
    </section>
  );
};

export default AdminDash;
