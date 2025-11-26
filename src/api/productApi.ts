import { apiClient } from "./client";

export const getProducts = () => 
    apiClient("/api/products");
export const getProcuctsById = (id: number) => 
    apiClient(`/api/products/${id}`);
