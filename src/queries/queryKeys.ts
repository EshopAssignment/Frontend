export const qk = {
  me: ["me"] as const,              
  meProfile: ["me", "profile"] as const, 
  myOrders: ["my-orders"] as const,
  myOrder: (orderNumber: string) => ["my-order", orderNumber] as const,
};
