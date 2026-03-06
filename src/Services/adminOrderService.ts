import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type * as apiTypes from "@/api/types.gen";

export type AdminPagedOrders = apiTypes.PagedResultOfAdminOrderListItemDto;
export type AdminOrderListItem = apiTypes.AdminOrderListItemDto;
export type AdminOrderDetails = apiTypes.AdminOrderDetailsDto;
export type UpdateOrderStatusReq = apiTypes.AdminUpdateOrderStatusRequest;
export type SetTrackingReq = apiTypes.AdminSetTrackingRequest;
export type AdminOrderStatus = UpdateOrderStatusReq["orderStatus"];

export async function setTracking(
  id: number,
  body: SetTrackingReq
): Promise<void> {
  const res = await sdk.patchApiAdminOrdersByIdTracking({
    client: api,
    path: { id },
    body,
  });

  if (res.error) throw res.error;
}

export async function listOrders(opts: {
  page: number;
  pageSize: number;
  query?: string;
  status?: string;
  from?: Date | string;
  to?: Date | string;
}): Promise<AdminPagedOrders> {
  const res = await sdk.getApiAdminOrders({
    client: api,
    query: {
      page: opts.page,
      pageSize: opts.pageSize,
      query: opts.query,
      status: opts.status,
      from: opts.from ? new Date(opts.from).toISOString() : undefined,
      to: opts.to ? new Date(opts.to).toISOString() : undefined,
    },
  });

  if (res.error) throw res.error;

  return (
    res.data ?? {
      items: [],
      page: opts.page,
      pageSize: opts.pageSize,
      totalItems: 0,
      totalPages: 0,
    }
  );
}

export async function getOrderById(id: number): Promise<AdminOrderDetails> {
  const res = await sdk.getApiAdminOrdersById({
    client: api,
    path: { id },
  });

  if (res.error) throw res.error;
  return res.data!;
}

export async function updateOrderStatus(id: number, next: AdminOrderStatus): Promise<void> {
  const body: UpdateOrderStatusReq = { orderStatus: next };

  const res = await sdk.patchApiAdminOrdersByIdStatus({
    client: api,
    path: { id },
    body,
  });

  if (res.error) throw res.error;
}