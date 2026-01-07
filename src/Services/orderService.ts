import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type { CartItem } from "@/context/CartContext";

export type CreateOrderRequest = Parameters<typeof sdk.postApiOrder>[0]["body"];
export type OrderCreatedDto = NonNullable<
  Awaited<ReturnType<typeof sdk.postApiOrder>>["data"]
>;
export type OrderByIdDto = NonNullable<
  Awaited<ReturnType<typeof sdk.getApiOrderById>>["data"]
>;
export type OrderByNumberDto = NonNullable<
  Awaited<ReturnType<typeof sdk.getApiOrderByNumberByOrderNumber>>["data"]
>;

export type OrderDto = (OrderByIdDto | OrderByNumberDto) & {
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingCost: number;
  grandTotal?: number;
  productsSubtotal?: number;
  taxTotal?: number;
  orderNumber?: string;
};
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

  return {
    ...o,
    orderNumber: o?.orderNumber ?? o?.OrderNumber ?? o?.number ?? o?.orderNo,
    shippingCost: toNum(o?.shippingCost ?? o?.ShippingCost ?? o?.deliveryCost ?? 0),
    grandTotal: toNum(o?.grandTotal ?? o?.GrandTotal ?? 0),
    productsSubtotal: toNum(o?.productsSubtotal ?? o?.ProductsSubtotal ?? 0),
    taxTotal: toNum(o?.taxTotal ?? o?.TaxTotal ?? 0),
    shippingAddress: {
      street: String(shippingAddress?.street ?? shippingAddress?.Street ?? ""),
      city: String(shippingAddress?.city ?? shippingAddress?.City ?? ""),
      postalCode: String(shippingAddress?.postalCode ?? shippingAddress?.PostalCode ?? ""),
      country: String(shippingAddress?.country ?? shippingAddress?.Country ?? "SE"),
    },
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
    customerFirstName: "Pall",
    customerLastName: "McPall",
    customerEmail: "pall.mcpall@pall.pall",
    customerPhoneNumber: "0809090901",
    shippingAddress: {
      street: "Pallgatan",
      city: "Falkenberg",
      postalCode: "31135",
      country: "SE",
    },
    items: cartItems.map((x) => ({
      productId: x.productId,
      quantity: x.quantity,
    })),
    reservationTtlMinutes: 60,
    cartId,
    currency: "SEK",

    shippingCost: 0,
  };

  return createOrder(body);
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
