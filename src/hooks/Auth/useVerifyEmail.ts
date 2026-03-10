import { confirmEmail } from "@/Services/authService";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import type { VerifyState } from "@/types/VerifyState";

export function useVerifyEmail(userId?: number, token?: string): VerifyState {
  const { mutate, status, error } = useMutation({
    mutationFn: async () => {
      if (!userId || !token) {
        throw new Error("Ogiltig verifieringslänk.");
      }

      await confirmEmail(userId, token);
    },
  });

  useEffect(() => {
    if (!userId || !token) return;
    if (status !== "idle") return;

    mutate();
  }, [userId, token, status, mutate]);

  if (!userId || !token) {
    return {
      status: "error",
      message: "Ogiltig verifieringslänk.",
    };
  }

  if (status === "pending") {
    return { status: "loading" };
  }

  if (status === "success") {
    return { status: "success" };
  }

  if (status === "error") {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Verifiering misslyckades.",
    };
  }

  return { status: "idle" };
}