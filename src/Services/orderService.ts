import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type { CartItem } from "@/context/CartContext";

export type CreateOrderRequest = Parameters<typeof sdk.postApiOrder>[0]["body"];
export type OrderCreatedDto = NonNullable<Awaited<ReturnType<typeof sdk.postApiOrder>>["data"]>;
export type OrderByIdDto = NonNullable<  Awaited<ReturnType<typeof sdk.getApiOrderById>>["data"]>;
export type OrderByNumberDto = NonNullable<Awaited<ReturnType<typeof sdk.getApiOrderByNumberByOrderNumber>>["data"]>;
export type UpdateOrderCustomerRequest = Parameters<typeof sdk.patchApiOrderByNumberByOrderNumberCustomer>[0]["body"];
export type UpdateOrderShippingAddressRequest = Parameters<typeof sdk.patchApiOrderByNumberByOrderNumberShippingAddress>[0]["body"];
export type MyOrdersDto = NonNullable<Awaited<ReturnType<typeof sdk.getApiMeOrders>>["data"]>;
export type MyOrderDetailsDto = NonNullable<Awaited<ReturnType<typeof sdk.getApiMeOrdersByOrderNumber>>["data"]>;

export type OrderDto = (OrderByIdDto | OrderByNumberDto) & {
  orderNumber: string;
  shippingCost: number;
  grandTotal: number;
  productsSubtotal: number;
  taxTotal: number;

  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  } | null;

  customerFirstName?: string | null;
  customerLastName?: string | null;
  customerEmail?: string | null;
  customerPhoneNumber?: string | null;

  shippingCarrier?: string | null;
  shippingMethod?: string | null;
};
export type MyOrderListItem = {
  date: string;
  orderNumber: string;
  status: string;
  total: number;
  trackingUrl?: string | null;
  receiptUrl?: string | null;
};



//helpers 
function toNum(x: any): number {
  const n = typeof x === "string" ? Number(x) : typeof x === "number" ? x : NaN;
  return Number.isFinite(n) ? n : 0;
}

function normalizeOrder(o: any): OrderDto {
  const shippingAddress =
    o?.shippingAddress ??
    o?.ShippingAddress ??
    o?.address ??
    o?.shipping ??
    null;

  const hasAddress =
    shippingAddress &&
    String(shippingAddress?.postalCode ?? shippingAddress?.PostalCode ?? "").trim().length > 0;
  
return {
    ...o,
    orderNumber: String(o?.orderNumber ?? o?.OrderNumber ?? o?.number ?? o?.orderNo ?? ""),
    shippingCost: toNum(o?.shippingCost ?? o?.ShippingCost ?? o?.deliveryCost ?? 0),
    grandTotal: toNum(o?.grandTotal ?? o?.GrandTotal ?? 0),
    productsSubtotal: toNum(o?.productsSubtotal ?? o?.ProductsSubtotal ?? 0),
    taxTotal: toNum(o?.taxTotal ?? o?.TaxTotal ?? 0),

    customerFirstName: o?.customerFirstName ?? o?.CustomerFirstName ?? null,
    customerLastName: o?.customerLastName ?? o?.CustomerLastName ?? null,
    customerEmail: o?.customerEmail ?? o?.CustomerEmail ?? null,
    customerPhoneNumber: o?.customerPhoneNumber ?? o?.CustomerPhoneNumber ?? null,

    shippingCarrier: o?.shippingCarrier ?? o?.ShippingCarrier ?? null,
    shippingMethod: o?.shippingMethod ?? o?.ShippingMethod ?? null,

    shippingAddress: hasAddress
      ? {
          street: String(shippingAddress?.street ?? shippingAddress?.Street ?? ""),
          city: String(shippingAddress?.city ?? shippingAddress?.City ?? ""),
          postalCode: String(shippingAddress?.postalCode ?? shippingAddress?.PostalCode ?? ""),
          country: String(shippingAddress?.country ?? shippingAddress?.Country ?? "SE"),
        }
      : null,
  };
}





export async function createOrder(body: CreateOrderRequest): Promise<OrderCreatedDto> {
  const res = await sdk.postApiOrder({ client: api, body });
  if (res.error) throw res.error;
  return res.data!;
}
export async function createOrderFromCart(
  cartItems: CartItem[],
  cartId: string
): Promise<OrderCreatedDto> {
    const body: CreateOrderRequest = {
      items: cartItems.map((x) => ({
        productId: x.productId,
        quantity: x.quantity,
      })),
      reservationTtlMinutes: 60,
      cartId,
      currency: "SEK",
    };

    return createOrder(body)
}
export async function getOrderById(
  id: number,
  opts?: { signal?: AbortSignal }
): Promise<OrderDto> {
  const res = await sdk.getApiOrderById({
    client: api,
    path: { id },
    signal: opts?.signal,
  });
  if (res.error) throw res.error;
  return normalizeOrder(res.data!);
}
export async function getOrderByNumber(
  orderNumber: string,
  opts?: { signal?: AbortSignal }
): Promise<OrderDto> {
  const res = await sdk.getApiOrderByNumberByOrderNumber({
    client: api,
    path: { orderNumber },
    signal: opts?.signal,
  });
  if (res.error) throw res.error;
  
  return normalizeOrder(res.data!);
}
export async function updateOrderCustomer(orderNumber: string, body: UpdateOrderCustomerRequest) {
  const res = await sdk.patchApiOrderByNumberByOrderNumberCustomer({
    client:api,
    path: {orderNumber},
    body,
  });
  if (res.error) throw res.error

}
export async function updateOrderShippingAddress(orderNumber: string, body: UpdateOrderShippingAddressRequest) {
  const res = await sdk.patchApiOrderByNumberByOrderNumberShippingAddress({
    client: api,
    path: { orderNumber },
    body,
  });
  if (res.error) throw res.error;
}
export async function getMyOrders(args?: { skip?: number; take?: number; signal?: AbortSignal }): Promise<MyOrderListItem[]> {
  const skip = Math.max(0, args?.skip ?? 0);
  const take = Math.max(1, Math.min(100, args?.take ?? 20));

  const res = await sdk.getApiMeOrders({
    client: api,
    query: { skip, take },
    signal: args?.signal,
  });

  if (res.error) throw res.error;

  const data = res.data ?? [];
  const arr = Array.isArray(data) ? data : [];

  return arr.map((o: any) => ({
    date: String(o.createdAtUtc ?? o.CreatedAtUtc ?? ""),
    orderNumber: String(o.orderNumber ?? o.OrderNumber ?? ""),
    status: String(o.orderStatus ?? o.OrderStatus ?? ""),
    total: toNum(o.grandTotal ?? o.GrandTotal ?? 0),
    trackingUrl: o.trackingUrl ?? o.TrackingUrl ?? null,
    receiptUrl: o.receiptUrl ?? o.ReceiptUrl ?? null,
  }));
}
export async function getMyOrderDetailsByNumber(
  orderNumber: string,
  opts?: { signal?: AbortSignal }
): Promise<MyOrderDetailsDto> {
  const res = await sdk.getApiMeOrdersByOrderNumber({
    client: api,
    path: { orderNumber },
    signal: opts?.signal,
  });

  if (res.error) throw res.error;
  return res.data!;
}

