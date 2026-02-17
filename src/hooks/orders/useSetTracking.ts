import { adminOrderQk } from "@/constants/queryKeys";
import { setTracking } from "@/Services/adminOrderService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSetTracking() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (vars: {id:number; trackingNumber: string; markAsShipped: boolean}) => 
            setTracking(vars.id, {
                trackingNumber:vars.trackingNumber,
                markAsShipped: vars.markAsShipped,
            }),

            onSettled: (_data, _err, vars) => {
                qc.invalidateQueries({queryKey: ["admin-orders"]});
                if (vars?.id) qc.invalidateQueries({queryKey: adminOrderQk.details(vars.id)});
            },
    });
}