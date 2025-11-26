import { useQuery } from "@tanstack/react-query";
import * as productApi from "../api/productApi"

export const useProducts = () => 
    useQuery({
        queryKey:["products"],
        queryFn: productApi.getProducts
});

export const useProduct = (id: number) => 
    useQuery ({
        queryKey: ["products", id],
        queryFn: () => productApi.getProcuctsById(id),
        enabled: !!id
});