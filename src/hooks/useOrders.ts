import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as orderApi from "../api/orderApi";

const ORDERS = {
  one: (id: number) => ["orders", id] as const,
};

export const useOrder = (id: number | null | undefined) => 
  useQuery({
    queryKey: id ? ORDERS.one(id) : ["orders", "none"],
    enabled: !!id,
    queryFn: ({ signal }) => orderApi.getOrderById(id as number, { signal })
  });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: orderApi.CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: (created) => {
      const maybeNum = Number(created.orderNumber);
      if (!Number.isNaN(maybeNum)) {
        qc.setQueryData(["orders", maybeNum], created);
      }
    }
  });
};
