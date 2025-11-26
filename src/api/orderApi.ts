
import { apiClient } from "./client";

export interface CreateOrderItemRequest  {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  shippingCity: string;
  shippingStreet: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: CreateOrderItemRequest[];
}

export interface OrderCreatedDto {
  orderId: string;      
  orderNumber: string;  
  orderDate: string;   
  total: number;
}

type FetchOpts = { signal?: AbortSignal };

export const createOrder = (data: CreateOrderRequest, opts?: FetchOpts) =>
  apiClient(`/api/Order`, {
    method: "POST",
    body: JSON.stringify(data),
    signal: opts?.signal
  }) as Promise<OrderCreatedDto>;

export const getOrderById = (id: number, opts?: FetchOpts) =>
  apiClient(`/api/Order/${id}`, {
    signal: opts?.signal
  }) as Promise<OrderCreatedDto>;
