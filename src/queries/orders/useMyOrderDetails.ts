import { getMyOrderDetailsByNumber } from "@/Services/orderService";
import { useQuery } from "@tanstack/react-query"
import { qk } from "../queryKeys";

export function useMyOrderDetails(orderNumber: string | null) {
  return useQuery({
    queryKey: orderNumber ? qk.myOrder(orderNumber) : qk.myOrder("none"),
    enabled: !!orderNumber,
    queryFn: ({ signal }) => getMyOrderDetailsByNumber(orderNumber as string, { signal }),
    staleTime: 10_000,
  });
}