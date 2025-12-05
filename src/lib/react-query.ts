import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { staleTime: 10_000, retry: 1, refetchOnWindowFocus: false },
        mutations: { retry: 0 },
      },
    });
  }
  return queryClient;
}