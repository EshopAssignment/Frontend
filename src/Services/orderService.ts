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
    customerFirstName: 'Pall',
    customerLastName: 'McPall',
    customerEmail: 'pall.mcpall@pall.pall',
    customerPhoneNumber: '0809090901',
    shippingAddress: {
      street: 'Pallgatan',
      city: 'Pallkenberg',
      postalCode: '12345',
      country: 'SE',
    },
    items: cartItems.map(x => ({
      productId: x.productId,
      quantity: x.quantity,
    })),
    currency: 'SEK',
    shippingCost: 0,
  };
  return createOrder(body);
}

export async function getOrderById(id: number, opts?: { signal?: AbortSignal }): Promise<OrderDto> {
  const res = await sdk.getApiOrderById({ client: api, path: { id }, signal: opts?.signal });
  if (res.error) throw res.error;
  return res.data!;
}

export async function getApiOrderByNumberByOrderNumber(orderNumber: string, opts?: { signal?: AbortSignal }): Promise<OrderDto> {
  const res = await sdk.getApiOrderByNumberByOrderNumber({ client: api, path: { orderNumber }, signal: opts?.signal });
  if (res.error) throw res.error;
  return res.data!;
}

