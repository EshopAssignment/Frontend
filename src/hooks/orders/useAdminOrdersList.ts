import { adminOrderQk } from "@/constants/queryKeys";
import { listOrders, type AdminPagedOrders } from "@/Services/adminOrderService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 20;

export function useAdminOrdersList(page: number, query: string, status: string) {
  const normalizedQuery = query.trim() || undefined;
  const normalizedStatus = status.trim() || undefined;

  return useQuery<AdminPagedOrders>({
    queryKey: adminOrderQk.list(page, normalizedQuery ?? "", normalizedStatus ?? ""),
    queryFn: () =>
      listOrders({
        page,
        pageSize: PAGE_SIZE,
        query: normalizedQuery,
        status: normalizedStatus,
      }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}