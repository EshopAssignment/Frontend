import { apiClient } from "../api/client";

export type AdminOrderListItem = {
    id:number;
    orderNumber: string;
    orderDate: string;
    customerName: string;
    customerEmail: string;
    orderStatus: string;
    total: number;
};

export type AdminOrderDetails = {
    id: number;
    orderNumber: string;
    orderDate: string;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    customerPhoneNumber: string;
    shippingStreet: string;
    shippingPostalCode: string;
    shippingCity: string;
    shippingCountry: string;
    orderStatus: string;
    productsTotal: number;
    shippingCost: number;
    total: number;
    items: { productId: number; productName: string; price: number; quantity: number; lineTotal: number; }[];
}

export type Paged<T> = { page: number; pageSize: number; totalItems: number; totalPages: number; items: T[]; };

const base = "/api/admin/orders"

export function listOrders(params: {
    page:number;
    pageSize: number;
    query?: string;
    orderStatus?: string;
    from?: string;
    to?: string;
}){
    const qs = new URLSearchParams({
        page: String(params.page),
        pageSize: String(params.pageSize),
        ...(params.query? {query: params.query} : {}),
        ...(params.orderStatus? {query: params.orderStatus} : {}),
        ...(params.from? {query: params.from} : {}),
        ...(params.to? {query: params.to} : {}),
    }).toString();
    return apiClient(`${base}?${qs}`) as Promise<Paged<AdminOrderListItem>>;
}

export function getOrderById(id: number){
    return apiClient(`${base}/${id}`) as Promise<AdminOrderDetails>;
}

export function updateOrderStatus(id: number, orderStatus: string) {
  return apiClient(`${base}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ orderStatus }),
  }) as Promise<void>;
}