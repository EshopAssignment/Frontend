import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLogin, useRegister } from "@/queries/auth";
import toast from "react-hot-toast";
import { toFieldErrors } from "@/lib/FieldErrors";
import { setRedirectToast } from "@/lib/redirectToast";

type FormValues = {
  displayName: string;
  email: string;
  password: string;
  confirm: string;
};

export default function SignUpForm() {
const {
  register,
  handleSubmit,
  watch,
  setError,
  clearErrors,
  formState: { errors, isSubmitting },
} = useForm<FormValues>();

  const [serverErr, setServerErr] = useState<string | null>(null);
  const nav = useNavigate();
  const loc = useLocation() as any;
  const from = loc.state?.from?.pathname ?? "/"
  const regMut = useRegister();
  const loginMut = useLogin();

const onSubmit = async (data: FormValues) => {
  setServerErr(null);
  clearErrors();

  const email = data.email.trim();
  const displayName = data.displayName.trim();

  try {
    await regMut.mutateAsync({ displayName, email, password: data.password });
    await loginMut.mutateAsync({ email, password: data.password });

    setRedirectToast({ type: "success", message: `Välkommen, ${displayName}.` });
    nav(from, { replace: true });
  } catch (e) {
    const fe = toFieldErrors(e);
    if (fe) {
      if (fe.email) setError("email", { type: "server", message: fe.email });
      if (fe.displayName) setError("displayName", { type: "server", message: fe.displayName });
      if (fe.password) setError("password", { type: "server", message: fe.password });
    } else {
      setServerErr("Registrering misslyckades.");
    }

    toast.error("Något gick fel");
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
          <label htmlFor="displayName">Namn</label>
          <input
            className="input"
            id="displayName"
            type="text"
            autoComplete="name"
            {...register("displayName", {
              required: "Namn krävs",
              minLength: { value: 2, message: "Minst 2 tecken" },
            })}
          />
          {errors.displayName && <p className="form-error">{errors.displayName.message}</p>}
        </div>


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
            autoComplete="new-password"
            {...register("password", {
              required: "Lösenord krävs",
              minLength: { value: 8, message: "Minst 8 tecken" },
            })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="confirm">Bekräfta lösenord</label>
          <input
            className="input"
            id="confirm"
            type="password"
            autoComplete="new-password"
            {...register("confirm", {
              required: "Bekräfta lösenordet",
              validate: (value) => value === watch("password") || "Lösenorden matchar inte",
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
