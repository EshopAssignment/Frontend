import { createClient } from "@/api/client/client.gen";

let refreshPromise: Promise<Response> | null = null;

function normalizeBase(url?: string) {
  return (url ?? "").replace(/\/+$/, "");
}

//certified clankermade component.
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
    // Normalisera indata till url + init
    let url: string;
    let method: string;
    let headers = new Headers();
    let body: any = null;

    if (input instanceof Request) {
      // Starta från Request
      url = input.url;
      method = input.method;

      // Headers från Request
      input.headers.forEach((v, k) => headers.set(k, v));

      // Init-values override: method/headers/body etc kan komma via init
      if (init?.headers) {
        new Headers(init.headers).forEach((v, k) => headers.set(k, v));
      }
      method = init?.method ?? method;

      // Body-prio: init.body först, annars läs request-body
      if (init?.body !== undefined) {
        body = init.body;
      } else if (method !== "GET" && method !== "HEAD") {
        // Klona och läs request-bodyn om möjligt
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

    // Content-Type och body-normalisering
    if (body instanceof FormData) {
      headers.delete("Content-Type"); // låt browsern sätta boundary
    } else if (body != null) {
      if (typeof body === "object" && !(body instanceof Blob) && !(body instanceof ArrayBuffer)) {
        // JS-objekt → JSON
        body = JSON.stringify(body);
        if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
      } else if (typeof body === "string") {
        // Sträng: om Content-Type saknas och den ser ut som JSON → sätt header
        if (!headers.has("Content-Type") && /^[\s]*[{[]/.test(body)) {
          headers.set("Content-Type", "application/json");
        }
      }
    }

    // Debug: se att vi faktiskt skickar body och CT
    console.log("🔍 API Request", {
      url,
      method,
      contentType: headers.get("Content-Type"),
      bodyPreview: typeof body === "string" ? body.slice(0, 120) : body instanceof FormData ? "[FormData]" : typeof body
    });

    return withAuthFetch(url, {
      method,
      headers,
      body,
      credentials: "include"
    });
  }
});
