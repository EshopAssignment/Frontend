import { createClient } from "@/api/client/client.gen";

export const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL
});