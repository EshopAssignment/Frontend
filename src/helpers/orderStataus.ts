export const STATUS_TO_NUM = {
  Pending: 0,
  Confirmed: 1,
  Processing: 2,
  Shipped: 3,
  Completed: 4,
  Cancelled: 5,
  Failed: 6,
  Refunded: 7,
} as const;

export type StatusKey = keyof typeof STATUS_TO_NUM;

export const NUM_TO_STATUS: Record<number, StatusKey> = {
  0: "Pending",
  1: "Confirmed",
  2: "Processing",
  3: "Shipped",
  4: "Completed",
  5: "Cancelled",
  6: "Failed",
  7: "Refunded",
};

export const STATUSES: readonly StatusKey[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Completed",
  "Refunded",
  "Failed",
  "Cancelled",
] as const;

export function toStatusKey(raw: unknown): StatusKey {
  if (typeof raw === "string" && raw in STATUS_TO_NUM) return raw as StatusKey;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? (NUM_TO_STATUS[n] ?? "Pending") : "Pending";
}
