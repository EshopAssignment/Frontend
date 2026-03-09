import { resetPassword } from "@/Services/authService";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
    email?: string;
    token?: string,
}

export default function ResetPasswordForm({ email, token }: Props) {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const resetPasswordMutation = useMutation({
        mutationFn: async(vars: {email: string, token: string, newPassword: string}) => {
            await resetPassword(vars.email, vars.token, vars.newPassword);
        } ,
    })

    const valid = password.length >= 8 && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !token || !valid) return;

    await resetPasswordMutation.mutateAsync({
      email,
      token,
      newPassword: password,
    });
  };

  if (!email || !token) {
    return (
      <div>
        <h1>Ogiltig länk!</h1>
        <Link to="/auth/login">Tillbaka till login</Link>
      </div>
    );
  }

  if (resetPasswordMutation.isSuccess) {
    return (
      <div className="auth-form-container">
        <div className="form-header">
          <Link className="btn-return" to="/auth/login" aria-label="Tillbaka till inloggning">
            <i className="fa-solid fa-backward" />
          </Link>
          <h1>Återställ lösenord</h1>
        </div>

        <p>Lösenord uppdaterat.</p>
        <Link to="/auth/login">Logga in</Link>
      </div>
    );
  }

  const errorMessage =
    resetPasswordMutation.error instanceof Error
      ? resetPasswordMutation.error.message
      : "Återställning misslyckades.";

  return (
    <div className="auth-form-container">
      <div className="form-header">
        <Link className="btn-return" to="/auth/login" aria-label="Tillbaka till inloggning">
          <i className="fa-solid fa-backward" />
        </Link>
        <h1>Återställ lösenord</h1>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <input
            className="input"
            type="password"
            placeholder="Nytt lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            className="input"
            type="password"
            placeholder="Upprepa lösenord"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button className="btn" disabled={!valid || resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? "Sparar…" : "Spara"}
        </button>

        {resetPasswordMutation.isError && <p className="error">{errorMessage}</p>}
      </form>
    </div>
    )
}
