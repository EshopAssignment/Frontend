import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/Services/orderService";
import { meQk } from "@/constants/queryKeys";

export function useMyOrders(args?: { skip?: number; take?: number }) {
  const skip = args?.skip ?? 0;
  const take = args?.take ?? 20;

  return useQuery({
    queryKey: [...meQk.orders(), { skip, take }] as const,
    queryFn: ({ signal }) => getMyOrders({ skip, take, signal }),
    staleTime: 10_000,
  });
}