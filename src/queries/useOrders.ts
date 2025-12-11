import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrderById,createOrder,type CreateOrderRequest,type OrderDto, type OrderCreatedDto,} from '@/Services/orderService';
import { ORDERS } from './keys';

export function useOrder(id: number | null | undefined) {
  return useQuery<OrderDto>({
    queryKey: id ? ORDERS.one(id!) : ['orders', 'none'],
    enabled: Number.isFinite(id as number) && !!id,
    queryFn: ({ signal }) => getOrderById(id as number, { signal }),
    staleTime: 10_000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();

  return useMutation<OrderCreatedDto, Error, CreateOrderRequest>({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: (created) => {
      const id = Number(created.orderId);
      if (Number.isFinite(id)) {
        qc.setQueryData(ORDERS.one(id), created);
      }

      const num = created.orderNumber;
      if (num) {
        qc.setQueryData(ORDERS.byNumber(num), created);
      }
    },
  });
}
