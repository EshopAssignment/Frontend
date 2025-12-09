import { createClient } from "@/api/client/client.gen";

let refreshing = false;

async function withAuthFetch(input: RequestInfo | URL, init?: RequestInit) {
  const cfg: RequestInit = { credentials: "include", ...init };
  const alreadyRetried = (cfg.headers as any)?.["x-retried"] === "1";

  const res = await fetch(input, cfg);

  if (res.status === 401 && !alreadyRetried) {
    if (!refreshing) {
      refreshing = true;
      try {
        const base = import.meta.env.VITE_API_URL!.replace(/\/+$/, "");
        const r = await fetch(`${base}/auth/refresh`, { method: "POST", credentials: "include" });
        if (!r.ok) return res;
      } finally {
        refreshing = false;
      }
    } else {
      await new Promise(s => setTimeout(s, 150));
    }
    const retryInit: RequestInit = { ...cfg, headers: { ...(cfg.headers as any), "x-retried": "1" } };
    return fetch(input, retryInit);
  }

  return res;
}

export const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL,
  fetch: withAuthFetch, 
});