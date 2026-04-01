import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen"
import type * as apiTypes from "@/api/types.gen"

export type AdminFulfullmentOrder = apiTypes.AdminFulfillmentOrderDto;
export type AdminFulfillmentQueue = apiTypes.PagedResultDtoOfAdminFulfillmentOrderDto;
export type FulfillmentStatus = apiTypes.FulfillmentStatus;
export type MarkOrderFulfilledRequest = apiTypes.MarkOrderFulfillmentRequest;
export type ReopenFulfillmentRequest = apiTypes.ReopenFulfillmentRequest;
export type SetFulfillmentNoteRequest = apiTypes.SetFulfillmentNoteRequest;

export async function listFulfillmentQueue(opts: {
    page: number,
    pageSize:number,
    query?: string;
    overdueOnly?:boolean;
    fulfillmentStatus: FulfillmentStatus;
}): Promise<AdminFulfillmentQueue> {
    const res = await sdk.getApiAdminFulfillmentQueue({
        client: api,
        query: {
            page:opts.page,
            pageSize:opts.pageSize,
            query:opts.query,
            overdueOnly: opts.overdueOnly,
            fulfillmentStatus: opts.fulfillmentStatus,
        },
    });
    if (res.error) throw res.error;

    return(
        res.data?? {
            items:[],
            page:opts.page,
            pageSize:opts.pageSize,
            totalCount:0,
        }
    );
}
export async function getFulfillmentById(id:number): Promise<AdminFulfullmentOrder> {
    const res = await sdk.getApiAdminFulfillmentByOrderId({
        client: api,
        path: {orderId: id},
    });
    if (res.error) throw res.error
    return res.data!;
}
export async function markFulfilled(
    id: number,
    body: MarkOrderFulfilledRequest
): Promise<void>{
    const res = await sdk.postApiAdminFulfillmentByOrderIdMarkFulfilled({
        client: api,
        path: {orderId: id},
        body,
    });

    if (res.error) throw res.error;
}
export async function reopenFulfillment(
    id:number,
    body: ReopenFulfillmentRequest
): Promise<void> {
    const res =await sdk.postApiAdminFulfillmentByOrderIdReopen({
        client:api,
        path:{orderId: id},
        body,
    });
    if (res.error) throw res.error
}
export async function setFulfillmentNote(
    id: number,
    body: SetFulfillmentNoteRequest
): Promise<void>{
    const res = await sdk.putApiAdminFulfillmentByOrderIdNote({
        client: api,
        path: {orderId: id},
        body,
    });
    if (res.error) throw res.error;
}