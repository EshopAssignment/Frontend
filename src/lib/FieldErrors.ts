export type FieldErrors = Record<string, string>;

function toCamelKey(key: string) {
  const last = key.split(".").pop() ?? key;
  return last.charAt(0).toLowerCase() + last.slice(1);
}

export function toFieldErrors(err: unknown): FieldErrors | null {
  const anyErr = err as any;

  const body =
    anyErr?.response?.data ??
    anyErr?.data ??
    anyErr;

  const errors = body?.errors;
  if (!errors || typeof errors !== "object") return null;

  const out: FieldErrors = {};
  for (const [k, v] of Object.entries(errors)) {
    if (Array.isArray(v) && v.length > 0) out[toCamelKey(k)] = String(v[0]);
  }

  return Object.keys(out).length ? out : null;
}
