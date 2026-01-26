import { getMyOrders } from "@/Services/orderService";
import {  useQuery } from "@tanstack/react-query";
import { qk } from "../queryKeys";

export function useMyOrders(args?: { skip?: number; take?: number }) {
  const skip = args?.skip ?? 0;
  const take = args?.take ?? 20;

  return useQuery({
    queryKey: [...qk.myOrders, skip, take],
    queryFn: ({ signal }) => getMyOrders({ skip, take, signal }),
    staleTime: 10_000,
  });
}