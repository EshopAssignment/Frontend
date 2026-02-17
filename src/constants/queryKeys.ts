export const adminOrderQk = {
    list: (page: number, query: string, status: string) => 
    ["admin-orders", {page, query, status}] as const,
    details: (id: number) => ["admin-orders", {id}] as const,
};