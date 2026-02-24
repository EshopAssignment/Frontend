import { confirmEmail } from "@/Services/authService";
import { useEffect, useState } from "react";

export type VerifyState = 
| { status: "idle"}
| { status: "loading"}
| { status: "success"}
| { status: "error"; message: string}

export function useVerifyEmail(userId?: number, token?: string) {
  const [state, setState] = useState<VerifyState>({ status: "idle" });

  useEffect(() => {
    if (!userId || !token) {
      setState({ status: "error", message: "Ogiltig verifieringslänk." });
      return;
    }

    const run = async () => {
      setState({ status: "loading" });

      try {
        await confirmEmail(userId, token);
        setState({ status: "success" });
      } catch (err: any) {
        setState({
          status: "error",
          message: err?.message ?? "Verifiering misslyckades.",
        });
      }
    };

    run();
  }, [userId, token]);

  return state;
}