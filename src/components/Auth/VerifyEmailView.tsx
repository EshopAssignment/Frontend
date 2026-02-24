import type { VerifyState } from "@/hooks/Auth/useVerifyEmail";
import { Link } from "react-router-dom";

interface Props {
  state: VerifyState;
}
export default function VerifyEmailView({state}: Props) {
    return (
        <div className="verify-email">
            <div className="form-header">
                <h1>Verifiera E-post</h1>
            </div>

            {state.status === "loading" && <p>Verifierar...</p>}

            {state.status === "success" && (
            <div className="verify-email-content">
                <p>Din epost är nu veriferad!</p>
                <Link className="btn" to="/auth/login">Logga in</Link>
            </div>
            )} 

            {state.status === "error" && (
            <div className="verify-email-content">
                <p className="error">{state.message}</p>
                <Link className="btn" to="/auth/login">Till inloggning</Link>
            </div>
            )}
        </div>
    )
}