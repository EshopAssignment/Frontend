import { useQuery } from "@tanstack/react-query";
import { getOrderById, type AdminOrderDetails } from "@/Services/adminOrderService";
import { adminOrderQk } from "@/constants/queryKeys";

export function useAdminOrderDetails(selectedId: number | null) {
  return useQuery<AdminOrderDetails>({
    queryKey: selectedId !== null ? adminOrderQk.detail(selectedId) : adminOrderQk.detail(0),
    queryFn: async () => {
        if (selectedId === null) throw new Error("Order id saknas.");
        return getOrderById(selectedId);
        },
    enabled: selectedId !== null,
    staleTime: 10_000,
  });
}