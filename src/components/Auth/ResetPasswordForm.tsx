import { useResetPassword } from "@/hooks/Auth/useResetPassword";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
    email?: string;
    token?: string,
}

export default function ResetPasswordForm({ email, token }: Props) {
    const { state, submit } = useResetPassword();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const valid = password.length >= 6 && password === confirm;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !token || !valid) return;
        submit(email, token, password);
    };

    if (!email || !token) {
        return (
            <div>
                <h1>ogiltig länk!</h1>
                <Link to="/auth/login">Tillbaka till Login</Link>
            </div>
        );
    }

    return (
        <div className="auth-form-container">
            <div className="form-header">
                <Link className="btn-return" to="/auth/login" aria-label="Tillbaka till inloggning">
                    <i className="fa-solid fa-backward" />
                </Link>
                <h1>Återställ lösenord</h1>
            </div>

            {state.status === "success" ? (
                <>
                    <p>Lösenord uppdaterat.</p>
                    <Link to="/auth/login">Logga in</Link>
                </>
            ) : (
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

                    <button className="btn" disabled={!valid || state.status === "loading"}>
                        {state.status === "loading" ? "Sparar…" : "Spara"}
                    </button>

                    {state.status === "error" && <p className="error">{state.message}</p>}
                </form>
            )}
        </div>
    );
}
