import { useQuery } from "@tanstack/react-query";
import { getOrderById, type AdminOrderDetails } from "@/Services/adminOrderService";
import { adminOrderQk } from "@/constants/queryKeys";

export function useAdminOrderDetails(selectedId: number | null ) {
    return useQuery<AdminOrderDetails>({
        queryKey: selectedId ? adminOrderQk.details(selectedId) : ["admin-order", { id: "none" }],
        queryFn: () => getOrderById(selectedId as number),
        enabled: selectedId !== null,
        staleTime: 10_000,
    });
}