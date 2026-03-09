import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateOrderStatus,
  type AdminOrderStatus,
  type AdminPagedOrders,
  type AdminOrderListItem,
  type AdminOrderDetails,
} from "@/Services/adminOrderService";
import { adminOrderQk } from "@/constants/queryKeys";

type UpdateOrderStatusVariables = {
  id: number;
  next: AdminOrderStatus;
};

type UpdateOrderStatusContext = {
  prev: [readonly unknown[], unknown][];
};

export function useUpdateOrderStatus() {
  const qc = useQueryClient();

  return useMutation<void, Error, UpdateOrderStatusVariables, UpdateOrderStatusContext>({
    mutationFn: ({ id, next }) => updateOrderStatus(id, next),

    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: adminOrderQk.all });

      const prev = qc.getQueriesData({ queryKey: adminOrderQk.all });

      prev.forEach(([key, snapshot]) => {
        const pageSnap = snapshot as AdminPagedOrders | undefined;
        if (!pageSnap) return;

        const items = (pageSnap.items ?? []).map((item: AdminOrderListItem) =>
          item.id === vars.id ? { ...item, orderStatus: vars.next } : item
        );

        qc.setQueryData(key, { ...pageSnap, items });
      });

      const detailsKey = adminOrderQk.detail(vars.id);
      const curDetails = qc.getQueryData<AdminOrderDetails>(detailsKey);

      if (curDetails) {
        qc.setQueryData(detailsKey, { ...curDetails, orderStatus: vars.next });
      }

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.prev?.forEach(([key, snapshot]) => {
        qc.setQueryData(key, snapshot);
      });
    },

    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries({ queryKey: adminOrderQk.all });

      if (vars?.id) {
        qc.invalidateQueries({ queryKey: adminOrderQk.detail(vars.id) });
      }
    },
  });
}