import { useQuery } from "@tanstack/react-query";
import { getMyOrderDetailsByNumber } from "@/Services/orderService";
import { meQk } from "@/constants/queryKeys";

export function useMyOrderDetails(orderNumber: string | null) {
  return useQuery({
    queryKey: orderNumber ? meQk.order(orderNumber) : meQk.order("none"),
    enabled: !!orderNumber,
    queryFn: ({ signal }) => getMyOrderDetailsByNumber(orderNumber!, { signal }),
    staleTime: 10_000,
  });
}