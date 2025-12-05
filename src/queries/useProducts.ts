import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  getProductsPaged,
  getProductById,
  suggestProducts,
  type PagedProducts,
  type ProductDto,
  type ProductSuggestionDto,
} from '@/Services/productService';
import { PRODUCTS } from './keys';

export type ProductSort = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
export type ProductFilters = {
  q?: string;
  sort?: ProductSort;
  type?: string[];
  condition?: string[];
  min?: number;
  max?: number;
};

function norm(f: ProductFilters) {
  return {
    q: f.q || undefined,
    sort: f.sort || undefined,
    type: f.type && f.type.length ? [...f.type].sort() : undefined,
    condition: f.condition && f.condition.length ? [...f.condition].sort() : undefined,
    min: Number.isFinite(f.min as number) ? f.min : undefined,
    max: Number.isFinite(f.max as number) ? f.max : undefined,
  };
}

export function useProductsPaged(page: number, pageSize: number, filters: ProductFilters) {
  const key = norm(filters);
  return useQuery<PagedProducts>({
    queryKey: PRODUCTS.paged(page, pageSize, key),
    queryFn: ({ signal }) =>
      getProductsPaged(page, pageSize, {
        signal,
        query: key.q,
        sort: key.sort,
        type: key.type,
        condition: key.condition,
        minPrice: key.min,
        maxPrice: key.max,
      }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}

export function useProduct(id: number | null | undefined) {
  return useQuery<ProductDto>({
    queryKey: id ? PRODUCTS.one(id) : ['products', 'none'],
    enabled: !!id,
    queryFn: () => getProductById(id as number),
    staleTime: 30_000,
  });
}

export function useProductSuggest(q: string, take = 8) {
  const enabled = q.trim().length >= 2;
  return useQuery<ProductSuggestionDto[]>({
    queryKey: PRODUCTS.suggest(q),
    enabled,
    queryFn: () => suggestProducts(q, take),
    staleTime: 30_000,
  });
}
