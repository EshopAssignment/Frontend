export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "object" && error !== null) {
    const err = error as {
      response?: {
        data?: unknown;
      };
      message?: string;
    };

    if (typeof err.response?.data === "string") return err.response.data;

    if (
      typeof err.response?.data === "object" &&
      err.response?.data !== null &&
      "message" in err.response.data &&
      typeof (err.response.data as { message?: unknown }).message === "string"
    ) {
      return (err.response.data as { message: string }).message;
    }

    if (typeof err.message === "string") return err.message;
  }

  return fallback;
}
