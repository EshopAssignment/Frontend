import { getAdminDashboard, type DashboardRange } from "@/Services/adminDashboardService";
import { useQuery } from "@tanstack/react-query";

export function useAdminDashboard(params: {
    range: DashboardRange;
    fromUtc?: string;
    toUtc?: string;
}) {
    return useQuery({
        queryKey: ["admin-dashboard", params],
        queryFn: () => getAdminDashboard(params),
        staleTime: 30_000,
    });
}