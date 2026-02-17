import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus, type AdminOrderStatus, type AdminPagedOrders } from "@/Services/adminOrderService";
import { adminOrderQk } from "@/constants/queryKeys";

export function useUpdateOrderStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, next }: { id: number; next: AdminOrderStatus }) =>
      updateOrderStatus(id, next),

    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["admin-orders"] });

      const prev = qc.getQueriesData({ queryKey: ["admin-orders"] });

      prev.forEach(([key, snapshot]) => {
        const pageSnap = snapshot as AdminPagedOrders | undefined;
        if (!pageSnap) return;

        const items = (pageSnap.items ?? []).map((i: any) =>
          i.id === vars.id ? { ...i, orderStatus: vars.next } : i
        );

        qc.setQueryData(key, { ...pageSnap, items });
      });

      const detailsKey = adminOrderQk.details(vars.id);
      const curDetails = qc.getQueryData(detailsKey) as any;
      if (curDetails) qc.setQueryData(detailsKey, { ...curDetails, orderStatus: vars.next });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.prev?.forEach(([key, snapshot]: any) => qc.setQueryData(key, snapshot));
    },

    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      if (vars?.id) qc.invalidateQueries({ queryKey: adminOrderQk.details(vars.id) });
    },
  });
}
