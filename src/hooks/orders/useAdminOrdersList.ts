import { adminOrderQk } from "@/constants/queryKeys";
import { listOrders, type AdminPagedOrders } from "@/Services/adminOrderService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 20;

export function useAdminOrdersList(page: number, query: string, status: string) {
  return useQuery<AdminPagedOrders>({
    queryKey: adminOrderQk.list(page, query, status),
    queryFn: () =>
      listOrders({
        page,
        pageSize: PAGE_SIZE,
        query: query || undefined,
        status: status || undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}