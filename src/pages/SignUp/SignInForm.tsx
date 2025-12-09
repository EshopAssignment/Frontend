import { api } from "@/lib/http";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

type FormValues = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [serverErr, setServerErr] = useState<string | null>(null);

  const nav = useNavigate();
  const loc = useLocation() as any;
  const from = loc.state?.from?.pathname ?? "/";

  const onSubmit = async (data: FormValues) => {
    setServerErr(null);
    try {
      const login = await api.request<{ expiresAt: string }>({
        method: "POST",
        url: "/auth/login",
        body: { email: data.email, password: data.password },
      });
      if (login.error) throw login.error;

      nav(from, { replace: true });
    } catch {
      setServerErr("Inloggning misslyckades. Kontrollera e-post och lösenord.");
    }
  };

  return (
    <div className="auth-form-container">
      <div className="form-header">
        <Link className="btn-return" to={"/"}>
          <i className="fa-solid fa-backward"></i>
        </Link>
        <h1>Logga in</h1>
      </div>

      <form className="auth-form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <label htmlFor="email">E-post</label>
          <input
            className="input"
            id="email"
            type="email"
            autoComplete="email"
            {...register("email", {
              required: "E-post krävs",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Ogiltig e-postadress",
              },
            })}
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Lösenord</label>
          <input
            className="input"
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: "Lösenord krävs",
              minLength: { value: 8, message: "Minst 8 tecken" },
            })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        {serverErr && <p className="form-error" role="alert">{serverErr}</p>}

        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Skickar..." : "Logga in!"}
        </button>
      </form>

      <div className="input-group">
        <Link to="/auth/register">Har du inget konto? Skapa ett här!</Link>
        <Link to={"company"}>Är du företagskund? Tryck här!</Link>
      </div>
    </div>
  );
}
