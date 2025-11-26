import type { CartItem } from "../context/CartContext";
import {
  createOrder as apiCreateOrder,
  getOrderById as apiGetOrderById,
  type CreateOrderRequest,
  type OrderCreatedDto
} from "../api/orderApi";

export type { CreateOrderRequest, OrderCreatedDto };

// tempdata for creating orders.
export async function CreateOrderFromCart(cartItems: CartItem[]): Promise<OrderCreatedDto> {
  const request: CreateOrderRequest = {
    customerFirstName: "Pall",
    customerLastName: "McPall",
    customerEmail: "pall.mcpall@pall.pall",
    customerPhoneNumber: "0809090901",
    shippingCity: "Pallkenberg",
    shippingStreet: "Pallgatan",
    shippingPostalCode: "12345",
    shippingCountry: "Pallaland",
    items: cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    })),
  };

  return apiCreateOrder(request);
}

export const getOrderById = (id: number, opts?: { signal?: AbortSignal }) =>
  apiGetOrderById(id, opts);
