import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getProductsPaged,
  getProductById,
  suggestProducts,
  type PagedProducts,
  type ProductDto,
  type ProductSuggestionDto,
  type SortUi,
} from "@/Services/productService";
import { productQk } from "@/constants/queryKeys";

export type ProductFilters = {
  q?: string;
  sort?: SortUi;
  type?: string[];
  condition?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  key?: string;
};

function normalizeFilters(filters: ProductFilters) {
  return {
    q: filters.q?.trim() || undefined,
    sort: filters.sort || undefined,
    type: filters.type?.length ? [...filters.type].sort() : undefined,
    condition: filters.condition?.length ? [...filters.condition].sort() : undefined,
    minPrice: Number.isFinite(filters.minPrice as number) ? filters.minPrice : undefined,
    maxPrice: Number.isFinite(filters.maxPrice as number) ? filters.maxPrice : undefined,
    inStock: filters.inStock === true ? true : undefined,
  };
}

export function useProductsPaged(page: number, pageSize: number, filters: ProductFilters) {
  const normalized = normalizeFilters(filters);

  return useQuery<PagedProducts>({
    queryKey: productQk.paged(page, pageSize, filters.key ?? normalized),
    queryFn: ({ signal }) =>
      getProductsPaged(page, pageSize, {
        signal,
        query: normalized.q,
        sort: normalized.sort,
        type: normalized.type,
        condition: normalized.condition,
        minPrice: normalized.minPrice,
        maxPrice: normalized.maxPrice,
        inStock: normalized.inStock,
      }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}

export function useProduct(id: number | null | undefined) {
  return useQuery<ProductDto>({
    queryKey: id != null ? productQk.detail(id) : productQk.detail(0),
    enabled: id != null,
    queryFn: () => getProductById(id!),
    staleTime: 30_000,
  });
}

export function useProductSuggest(q: string, take = 8) {
  const trimmed = q.trim();
  const enabled = trimmed.length >= 2;

  return useQuery<ProductSuggestionDto[]>({
    queryKey: productQk.suggest(trimmed),
    enabled,
    queryFn: () => suggestProducts(trimmed, take),
    staleTime: 30_000,
  });
}