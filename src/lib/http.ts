import { createClient } from "@/api/client/client.gen";

let refreshPromise: Promise<Response> | null = null;

function normalizeBase(url?: string) {
  return (url ?? "").replace(/\/+$/, "");
}

const BASE = normalizeBase(import.meta.env.VITE_API_URL);

async function doRefresh(): Promise<Response> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "x-refresh": "1" }
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function withTimeout(signal?: AbortSignal | null, ms = 20000) {
  if (signal != null) {
    return { signal, cleanup: () => {} };
  }

  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);

  return {
    signal: ctrl.signal,
    cleanup: () => clearTimeout(id),
  };
}

async function withAuthFetch(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers ?? {});
  const isJsonBody = init?.body && typeof init.body === "object" && !(init.body instanceof FormData);
  if (isJsonBody && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const { signal, cleanup } = withTimeout(init?.signal);
  const cfg: RequestInit = {
    credentials: "include",
    ...init,
    headers,
    signal
  };

  try {
    const res = await fetch(input, cfg);
    if (res.status !== 401) return res;

   
    const alreadyRetried = headers.get("x-retried") === "1";
    if (alreadyRetried) return res;

    await doRefresh(); 
    headers.set("x-retried", "1");
    const retry = await fetch(input, { ...cfg, headers });
    return retry;
  } finally {
 
    cleanup();
  }
}

async function ensureOk(res: Response) {
  if (res.ok) return res;
  let detail: any = null;
  const ct = res.headers.get("content-type") ?? "";
  try {
    detail = ct.includes("application/json") ? await res.json() : await res.text();
  } catch {}
  const err = new Error(`HTTP ${res.status} ${res.statusText}`) as any;
  err.status = res.status;
  err.detail = detail;
  throw err;
}

export async function httpJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await withAuthFetch(url, init);
  await ensureOk(res);
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export const api = createClient({
  baseUrl: BASE,
  fetch: async (input, init) => {
    const b = init?.body;
    const body = b && typeof b === "object" && !(b instanceof FormData) ? JSON.stringify(b) : b;
    return withAuthFetch(input, { ...init, body });
  }
});
