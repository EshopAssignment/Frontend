import { resetPassword } from "@/Services/authService";
import { useState } from "react";

export type ResetState = 
| {status: "idle"} 
| {status: "loading"} 
| {status: "success"} 
| {status: "error"; message: string};

export function useResetPassword() {
    const [state, setState] = useState<ResetState>({status: "idle"});

    const submit = async(
        email: string,
        token: string,
        newPassword:string
    ) => {
        setState({status: "loading"});

        try {
            await resetPassword(email, token, newPassword);
            setState({status: "success"});
        } catch (err: any) {
            setState({
                status: "error",
                message: err?.message ?? "Återställning misslyckades!"
            });
        }
    };
    return {state, submit};
}
