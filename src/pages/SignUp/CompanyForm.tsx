import { Link } from "react-router-dom";

const SignInForm = () => {
  return (
    <>
        <div className="auth-form-container">
          <div className="form-header">
            <Link className="btn-return" to={"/auth"}>
              <i className="fa-solid fa-backward"></i>
            </Link>
            <h1>Logga in Här!</h1>
          </div>

          <form className="auth-form" action="submit">
            <div className="input-group">
              <label  htmlFor="email">Företags Epost</label>
              <input className="input" id="email" type="text" />
            </div>
            <div className="input-group">
              <label  htmlFor="costnumb">Kundnummer</label>
              <input className="input" id="costnumb" type="text" />
            </div>
            <div className="input-group">
              <label  htmlFor="password">Lösenord</label>
              <input className="input" id="password" type="password" />
            </div>
            <button className="btn">Logga In!</button>
          </form>

          <div className="input-group">
            <Link to={"#"}>Vill du bli företagskund?</Link>
            <span>Kontaka oss på Sales@pall.se</span>
          </div>

        </div>
    
    </>
  );
};

export default SignInForm;