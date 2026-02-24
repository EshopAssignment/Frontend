import { forgotPassword } from "@/Services/authService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

type FormValues = {
    email: string;
    captchaToken?: string;
};

export default function ForgotPasswordPage() {
    const {
        register, handleSubmit, formState: {errors, isSubmitting},
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            email: "",
            captchaToken:"",
        },
        mode:"onSubmit",
    });

    const [serverMsg, setServerMsg] = useState<string | null>(null);
    const onSubmit = async (data: FormValues) => {
        setServerMsg(null);

        const email = data.email.trim().toLowerCase();

        try {
            await forgotPassword(email);

            setServerMsg("Vi har skickat en återställningslänk till din angivna E-post. Kolla även skräppost");
            toast.success("Återstlänningslänk skickad!")
            reset({email:"", captchaToken:""});
        } catch(e: any) {
            toast.error("något gick fel, kunde inte skicka återställningslänk");
            setServerMsg(e?.message ?? "kunde inte skicka återställningslänk");
        }
    };

    return (
    <div className="auth-form-container">
      <div className="form-header">
        <Link className="btn-return" to="/auth/login" aria-label="Tillbaka till inloggning">
          <i className="fa-solid fa-backward" />
        </Link>
        <h1>Återställ lösenord</h1>
      </div>

      <p className="form-help">
        Skriv in din e-postadress så skickar vi en länk för att återställa lösenordet.
      </p>

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

        
        <div className="captcha-slot" aria-hidden="true">
          {/*
                captcha här sen. 
          */}
        </div>

        {serverMsg && (
          <p className="form-info" role="status" style={{ whiteSpace: "pre-wrap" }}>
            {serverMsg}
          </p>
        )}

        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Skickar..." : "Skicka återställningslänk"}
        </button>
        </form>
    </div>
    )
}