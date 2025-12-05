import { api } from '@/lib/http';
import * as sdk from '@/api/sdk.gen';
import type { CartItem } from '@/context/CartContext';

export type CreateOrderRequest = Parameters<typeof sdk.postApiOrder>[0]['body'];
export type OrderCreatedDto = NonNullable<Awaited<ReturnType<typeof sdk.postApiOrder>>['data']>;
export type OrderDto = NonNullable<Awaited<ReturnType<typeof sdk.getApiOrderById>>['data']>;

export async function createOrder(body: CreateOrderRequest): Promise<OrderCreatedDto> {
  const res = await sdk.postApiOrder({ client: api, body });
  if (res.error) throw res.error;
  return res.data!;
}

export async function createOrderFromCart(cartItems: CartItem[]): Promise<OrderCreatedDto> {
  const body: CreateOrderRequest = {
    customerFirstName: "Pall",
    customerLastName: "McPall",
    customerEmail: "pall.mcpall@pall.pall",
    customerPhoneNumber: "0809090901",
    shippingCity: "Pallkenberg",
    shippingStreet: "Pallgatan",
    shippingPostalCode: "12345",
    shippingCountry: "Pallaland",
    items: cartItems.map(x => ({ productId: x.productId, quantity: x.quantity }))
  };
  return createOrder(body);
}

export async function getOrderById(id: number, opts?: { signal?: AbortSignal }): Promise<OrderDto> {
  const res = await sdk.getApiOrderById({ client: api, path: { id }, signal: opts?.signal });
  if (res.error) throw res.error;
  return res.data!;
}
