import { createClient } from "@/api/client/client.gen";

let refreshPromise: Promise<Response> | null = null;

function normalizeBase(url?: string) {
  return (url ?? "").replace(/\/+$/, "");
}

//genereated gpt5.2
const BASE = normalizeBase(import.meta.env.VITE_API_URL);

async function doRefresh(): Promise<Response> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { 
        "x-refresh": "1",
        "Content-Type": "application/json"
      }
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
    if (headers.get("x-retried") === "1") return res;
    
    await doRefresh();
    headers.set("x-retried", "1");
    return await fetch(input, { ...cfg, headers });
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
    let url: string;
    let method: string;
    let headers = new Headers();
    let body: any = null;

    if (input instanceof Request) {
      url = input.url;
      method = input.method;

      input.headers.forEach((v, k) => headers.set(k, v));

      if (init?.headers) {
        new Headers(init.headers).forEach((v, k) => headers.set(k, v));
      }
      method = init?.method ?? method;

      if (init?.body !== undefined) {
        body = init.body;
      } else if (method !== "GET" && method !== "HEAD") {
        try {
          const cloned = input.clone();
          body = await cloned.text();
          if (body === "") body = null;
        } catch {
          body = null;
        }
      }
    } else {
      url = typeof input === "string" ? input : input.toString();
      method = init?.method ?? "GET";
      if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
      body = init?.body ?? null;
    }

    
    if (body instanceof FormData) {
      headers.delete("Content-Type");
    } else if (body != null) {
      if (typeof body === "object" && !(body instanceof Blob) && !(body instanceof ArrayBuffer)) {
        body = JSON.stringify(body);
        if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
      } else if (typeof body === "string") {
        if (!headers.has("Content-Type") && /^[\s]*[{[]/.test(body)) {
          headers.set("Content-Type", "application/json");
        }
      }
    }
    return withAuthFetch(url, {
      method,
      headers,
      body,
      credentials: "include"
    });
  }
});
