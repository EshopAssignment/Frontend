import { setRedirectToast } from "@/lib/redirectToast";
import { useLogin } from "@/hooks/Auth/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReturnBtn from "@/components/Buttons/ReturnBtn";

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


const mut = useLogin();

const onSubmit = async (data: FormValues) => {
  setServerErr(null);

  const email = data.email.trim();

  try {
    await mut.mutateAsync({ email, password: data.password });

    setRedirectToast({ type: "success", message: "Välkommen tillbaka." });

    nav(from, { replace: true });
  } catch {
    toast.error("Något gick fel");
    setServerErr("Inloggning misslyckades. Kontrollera e-post och lösenord.");
  }
};

  return (
    <div className="auth-form-container">
      <div className="form-header">
        <ReturnBtn />
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

        <div className="form-error-block" role="alert">

        <div className="form-hint-links">
          <Link to={"/forgot-password"}>
            Glömt lösenord?
          </Link>
        </div>
        
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
