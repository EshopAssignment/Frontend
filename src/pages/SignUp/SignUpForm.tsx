import { Link } from "react-router-dom";

const SignUpForm = () => {
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
              <label htmlFor="firstname">Förnamn</label>
              <input className="input" id="email" type="text" />
            </div>

            <div className="input-group">
              <label htmlFor="lastname">Efternamn</label>
              <input className="input" id="email" type="text" />
            </div>

            <div className="input-group">
              <label htmlFor="email">Epost</label>
              <input className="input" id="email" type="text" />
            </div>

            <div className="input-group">
              <label htmlFor="password">Lösenord</label>
              <input className="input" id="password" type="password" />
            </div>

            <button className="btn">Registrera dig!</button>
          </form>

          <div className="input-group">
            <Link to={"login"}>Har du redan ett konto? Tryck Här!</Link>
            <p>Vill du bli företagskund? kontakta oss på sales@pallar.se</p>
          </div>

        </div>
    
    </>
  );
};

export default SignUpForm;