import { API_ORIGIN } from "../config";

export function buildImageUrl(raw?: string) {
  const val = (raw ?? "").trim();
  if (!val) return "";
  if (val.startsWith("http://") || val.startsWith("https://")) return val;
  if (val.startsWith("/")) return `${API_ORIGIN}${val}`;
  return val;
}
