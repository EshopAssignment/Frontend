import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type { CartItem } from "@/context/CartContext";
import type * as apiTypes from "@/api/types.gen";

export type CreateOrderRequest = apiTypes.CreateOrderRequestDto;
export type OrderCreatedDto = apiTypes.OrderCreatedDto;
export type UpdateOrderCustomerRequest = apiTypes.UpdateOrderCustomerDto;
export type UpdateOrderShippingAddressRequest = apiTypes.UpdateOrderShippingAddressDto;
export type MyOrdersDto = apiTypes.MyOrderListItemDto[];
export type MyOrderDetailsDto = apiTypes.OrderCreatedDto;

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

  return createOrder(body);
}

export async function getOrderById(
  id: number,
  opts?: { signal?: AbortSignal }
): Promise<OrderCreatedDto> {
  const res = await sdk.getApiOrderById({
    client: api,
    path: { id },
    signal: opts?.signal,
  });

  if (res.error) throw res.error;
  return res.data!;
}

export async function getOrderByNumber(
  orderNumber: string,
  opts?: { signal?: AbortSignal }
): Promise<OrderCreatedDto> {
  const res = await sdk.getApiOrderByNumberByOrderNumber({
    client: api,
    path: { orderNumber },
    signal: opts?.signal,
  });

  if (res.error) throw res.error;
  return res.data!;
}

export async function updateOrderCustomer(
  orderNumber: string,
  body: UpdateOrderCustomerRequest
): Promise<void> {
  const res = await sdk.patchApiOrderByNumberByOrderNumberCustomer({
    client: api,
    path: { orderNumber },
    body,
  });

  if (res.error) throw res.error;
}

export async function updateOrderShippingAddress(
  orderNumber: string,
  body: UpdateOrderShippingAddressRequest
): Promise<void> {
  const res = await sdk.patchApiOrderByNumberByOrderNumberShippingAddress({
    client: api,
    path: { orderNumber },
    body,
  });

  if (res.error) throw res.error;
}

export async function getMyOrders(args?: {
  skip?: number;
  take?: number;
  signal?: AbortSignal;
}): Promise<MyOrdersDto> {
  const skip = Math.max(0, args?.skip ?? 0);
  const take = Math.max(1, Math.min(100, args?.take ?? 20));

  const res = await sdk.getApiMeOrders({
    client: api,
    query: { skip, take },
    signal: args?.signal,
  });

  if (res.error) throw res.error;
  return res.data ?? [];
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