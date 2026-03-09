import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrderById,
  createOrder,
} from "@/Services/orderService";
import { orderQk } from "@/constants/queryKeys";
import type * as apiTypes from "@/api/types.gen";


export function useOrder(id: number | null | undefined) {
  return useQuery<apiTypes.OrderCreatedDto>({
    queryKey: id != null ? orderQk.detail(id) : orderQk.detail(0),
    enabled: id != null,
    queryFn: ({ signal }) => getOrderById(id!, { signal }),
    staleTime: 10_000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();

  return useMutation<apiTypes.OrderCreatedDto, Error, apiTypes.CreateOrderRequestDto>({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: (created) => {
      const id = Number(created.orderId);
      if (Number.isFinite(id)) {
        qc.setQueryData(orderQk.detail(id), created);
      }

      if (created.orderNumber) {
        qc.setQueryData(orderQk.byNumber(created.orderNumber), created);
      }
    },
  });
}