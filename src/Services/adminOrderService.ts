import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";

export type AdminPagedOrders =
  NonNullable<Awaited<ReturnType<typeof sdk.getApiAdminOrders>>["data"]>;

export type AdminOrderListItem =
  NonNullable<AdminPagedOrders["items"]>[number];

export type AdminOrderDetails =
  NonNullable<Awaited<ReturnType<typeof sdk.getApiAdminOrdersById>>["data"]>;

type PatchArgs = Parameters<typeof sdk.patchApiAdminOrdersByIdStatus>[0];
type PatchBody = NonNullable<PatchArgs>["body"];
export type AdminOrderStatus = PatchBody extends { orderStatus: infer S } ? S : never;


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
  return res.data!;
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
  const res = await sdk.patchApiAdminOrdersByIdStatus({
    client: api,
    path: { id },
    body: { orderStatus: next },
  });
  if (res.error) throw res.error;
}
