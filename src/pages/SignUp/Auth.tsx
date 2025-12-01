import { Link } from "react-router-dom";

const Auth = () => {
  return (
      <div>
            <Link  className="btn" to={"login"}>Logga in</Link>
            <Link  className="btn" to={"register"}>Registera dig!</Link>
      </div>
  );
};

export default Auth;