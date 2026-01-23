import toast from "react-hot-toast";
import { REDIRECT_TOAST } from "@/constants/storageKeys";

type RedirectToastPayload = {
  type: "success" | "error";
  message: string;
};

export function setRedirectToast(payload: RedirectToastPayload) {
  sessionStorage.setItem(REDIRECT_TOAST, JSON.stringify(payload));
}

export function consumeRedirectToast() {
  const raw = sessionStorage.getItem(REDIRECT_TOAST);
  if (!raw) return;

  sessionStorage.removeItem(REDIRECT_TOAST);

  try {
    const p = JSON.parse(raw) as RedirectToastPayload;
    if (p.type === "success") toast.success(p.message);
    else toast.error(p.message);
  } catch {
    //ignore
  }
}
