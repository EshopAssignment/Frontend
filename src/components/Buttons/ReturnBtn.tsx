import { Link } from "react-router-dom";

export default function ReturnBtn() {
    return(
        <Link className="btn-return" to={"/"}>
          <i className="fa-solid fa-backward"></i>
        </Link>
    )
}