import { confirmEmail } from "@/Services/authService";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

export function useVerifyEmail(userId?: number, token?: string) {
  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId || !token) {
        throw new Error("Ogiltig verifieringslänk.");
      }

      await confirmEmail(userId, token);
    },
  });

  useEffect(() => {
    if (!userId || !token) {
      return;
    }

    if (mutation.status === "idle") {
      mutation.mutate();
    }
  }, [userId, token, mutation]);

  if (!userId || !token) {
    return {
      status: "error" as const,
      message: "Ogiltig verifieringslänk.",
    };
  }

  if (mutation.status === "pending") {
    return { status: "loading" as const };
  }

  if (mutation.status === "success") {
    return { status: "success" as const };
  }

  if (mutation.status === "error") {
    return {
      status: "error" as const,
      message:
        mutation.error instanceof Error
          ? mutation.error.message
          : "Verifiering misslyckades.",
    };
  }

  return { status: "idle" as const };
}