import { useForm } from "react-hook-form";
import { api } from "@/lib/http";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

type FormValues = {
  display: string;
  email: string;
  password: string;
  confirm: string;
};

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const nav = useNavigate();
  const loc = useLocation() as any;
  const from = loc.state?.from?.pathname ?? "/";

  const [serverErr, setServerErr] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setServerErr(null);
    try {
      // Registrera
      const reg = await api.request({
        method: "POST",
        url: "/auth/register",
        body: { 
          email: data.email, 
          password: data.password, 
          displayName: data.display 
        },
      });
      if (reg.error) throw reg.error;

      // Auto-login
      const login = await api.request({
        method: "POST",
        url: "/auth/login",
        body: { email: data.email, password: data.password },
      });
      if (login.error) throw login.error;

      nav(from, { replace: true });
    } catch {
      setServerErr("Registrering misslyckades. Kontrollera uppgifterna.");
    }
  };

  return (
    <div className="auth-form-container">
      <div className="form-header">
        <Link className="btn-return" to={"/"}>
          <i className="fa-solid fa-backward"></i>
        </Link>
        <h1>Registrera dig</h1>
      </div>

      <form className="auth-form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <label>Användarnamn</label>
          <input
            className="input"
            {...register("display", { required: "Fyll i ett användarnamn" })}
          />
          {errors.display && <p className="form-error">{errors.display.message}</p>}
        </div>

        <div className="input-group">
          <label>E-post</label>
          <input
            className="input"
            type="email"
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
          <label>Lösenord</label>
          <input
            className="input"
            type="password"
            {...register("password", {
              required: "Lösenord krävs",
              minLength: {
                value: 8,
                message: "Minst 8 tecken",
              },
            })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        <div className="input-group">
          <label>Bekräfta Lösenord</label>
          <input
            className="input"
            type="password"
            {...register("confirm", {
              required: "Bekräfta lösenordet",
              validate: (value) =>
                value === watch("password") || "Lösenorden matchar inte",
            })}
          />
          {errors.confirm && <p className="form-error">{errors.confirm.message}</p>}
        </div>

        {serverErr && <p className="form-error">{serverErr}</p>}

        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Skickar..." : "Registrera dig!"}
        </button>
      </form>

      <div className="input-group">
        <Link to="/auth/login">Har du redan ett konto? Tryck här!</Link>
        <p>Vill du bli företagskund? kontakta oss på sales@pallar.se</p>
      </div>
    </div>
  );
}
