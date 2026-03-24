import {api} from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type * as apiTypes from "@/api/types.gen";

export type DashboardRange = "today" | "7d" | "30d" | "90d" | "1y" | "custom";

export type AdminDashboard = apiTypes.AdminDashboardDto;

export async function getAdminDashboard(params : {
    range: DashboardRange;
    fromUtc?: string;
    toUtc?: string 
}): Promise<AdminDashboard> {
    const res = await sdk.getApiAdminDashboard({
        client: api,
        query: {
            range: params.range,
            fromUtc: params.fromUtc,
            toUtc: params.toUtc,
        },
    });
    if (res.error) throw res.error;
    return res.data!;
}