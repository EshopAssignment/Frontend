
import type { CartItem } from "../context/CartContext";

const API_URL = "https://localhost:7152/api/order";

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

export async function CreateOrderFromCart(
    cartItems: CartItem[]

): Promise<OrderCreatedDto> {
    const request: CreateOrderRequest  = {

    customerFirstName: "Pall",
    customerLastName: "McPall",
    customerEmail: "Pall McPall@Pall.Pall",
    customerPhoneNumber: "0809090901",
    shippingCity: "Pallkenberg",
    shippingStreet: "Pallgatan",
    shippingPostalCode: "12345",
    shippingCountry: "Pallaland",
    items: cartItems.map((item)=> ({
        productId: item.productId,
        quantity: item.quantity
     })),
    };

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",

        },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Order failed: ${res.status} ${text}`);
    }

    return res.json();
}
