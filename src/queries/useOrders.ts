import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrderById,createOrder,type CreateOrderRequest,type OrderDto, type OrderCreatedDto,} from '@/Services/orderService';
import { ORDERS } from './keys';

export function useOrder(id: number | null | undefined) {
  return useQuery<OrderDto>({
    queryKey: id ? ORDERS.one(id!) : ['orders', 'none'],
    enabled: !!id,
    queryFn: ({ signal }) => getOrderById(id as number, { signal }),
    staleTime: 10_000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation<OrderCreatedDto, Error, CreateOrderRequest>({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: (created) => {
      const any = created as any;
      const id = Number(any.orderId ?? NaN);
      if (Number.isFinite(id)) qc.setQueryData(ORDERS.one(id), created);

      const num = String(any.orderNumber ?? '');
      if (num) qc.setQueryData(ORDERS.byNumber(num), created);
    },
  });
}
