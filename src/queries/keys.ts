export const PRODUCTS = {
  paged: (page: number, pageSize: number, key: unknown) =>
    ['products', 'paged', pageSize, page, key] as const,
  one: (id: number) => ['products', id] as const,
  suggest: (q: string) => ['products', 'suggest', q] as const,
};

export const ORDERS = {
  one: (id: number) => ['orders', id] as const,
  byNumber: (orderNumber: string) => ['orders', 'by-number', orderNumber] as const,
};