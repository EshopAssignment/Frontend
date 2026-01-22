import type { ProductFilters } from "@/helpers/productFilters";
import { getProductsPaged, type PagedProducts } from "@/Services/productService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useProductsPaged( page: number, pageSize: number, filters: ProductFilters) {
    return useQuery<PagedProducts>({
        queryKey: ["products", "paged", pageSize, page, filters.key], 
        queryFn: ({signal}) => 
            getProductsPaged(page, pageSize, {
                signal,
                query: filters.q,
                sort:filters.sort as any,
                type: filters.type,
                condition: filters.condition,
                minPrice: filters.minPrice,
                maxPrice:filters.maxPrice,
                inStock:filters.inStock, 
            }),
            placeholderData: keepPreviousData,
            staleTime: 10_000,
    });
}