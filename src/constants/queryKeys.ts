import type { AdminProductListParams } from "@/Services/adminProductService";


export const adminOrderQk = {
  all: ["admin-orders"] as const,
  lists: () => [...adminOrderQk.all, "list"] as const,
  list: (page: number, query: string, status: string) =>
    [...adminOrderQk.lists(), { page, query, status }] as const,
  details: () => [...adminOrderQk.all, "detail"] as const,
  detail: (id: number) => [...adminOrderQk.details(), id] as const,
};

export const adminProductQk = {
  all: ["admin-products"] as const,
  lists: () => [...adminProductQk.all, "list"] as const,
  list: (params: AdminProductListParams) =>
    [...adminProductQk.lists(), params] as const,
  details: () => [...adminProductQk.all, "detail"] as const,
  detail: (id: number) => [...adminProductQk.details(), id] as const,
  options: () => [...adminProductQk.all, "options"] as const,
};

export const meQk = {
  all: ["me"] as const,
  profile: () => [...meQk.all, "profile"] as const,
  orders: () => [...meQk.all, "orders"] as const,
  order: (orderNumber: string) => [...meQk.all, "orders", orderNumber] as const,
};

export const productQk = {
  all: ["products"] as const,
  paged: (page: number, pageSize: number, key: unknown) =>
    [...productQk.all, "paged", pageSize, page, key] as const,
  detail: (id: number) => [...productQk.all, id] as const,
  suggest: (q: string) => [...productQk.all, "suggest", q] as const,
};

export const orderQk = {
  all: ["orders"] as const,
  detail: (id: number) => [...orderQk.all, id] as const,
  byNumber: (orderNumber: string) =>
    [...orderQk.all, "by-number", orderNumber] as const,
};

export const adminCustomRequestQk = {
  all: ["admin-custom-requests"] as const,
  list: (params: unknown) => ["admin-custom-requests", "list", params] as const,
  detail: (id: number) => ["admin-custom-requests", "detail", id] as const,
};