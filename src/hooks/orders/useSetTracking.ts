import { adminOrderQk } from "@/constants/queryKeys";
import { setTracking } from "@/Services/adminOrderService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SetTrackingVariables = {
  id: number;
  trackingNumber: string;
  markAsShipped: boolean;
};

export function useSetTracking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, trackingNumber, markAsShipped }: SetTrackingVariables) =>
      setTracking(id, {
        trackingNumber,
        markAsShipped,
      }),

    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries({ queryKey: adminOrderQk.all });

      if (vars?.id) {
        qc.invalidateQueries({ queryKey: adminOrderQk.detail(vars.id) });
      }
    },
  });
}