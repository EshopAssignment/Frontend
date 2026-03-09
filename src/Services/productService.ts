import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type * as apiTypes from "@/api/types.gen";

export type PagedProducts = apiTypes.PagedResultOfProductDto;
export type ProductDto = apiTypes.ProductDto;
export type ProductSuggestionDto = apiTypes.ProductSuggestionDto;
export type SortUi = "price_asc" | "price_desc" | "name_asc" | "name_desc";

function cleanQueryParams<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};

  for (const [key, value] of Object.entries(obj) as [keyof T, T[keyof T]][]) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === "number" && Number.isNaN(value)) continue;

    out[key] = value;
  }

  return out;
}

export async function getProductsPaged(
  page: number,
  pageSize: number,
  opts: {
    signal?: AbortSignal;
    query?: string;
    sort?: SortUi;
    type?: string[];
    condition?: string[];
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  } = {}
): Promise<PagedProducts> {
  const { signal, ...rest } = opts;

  const query = cleanQueryParams({
    page,
    pageSize,
    query: rest.query,
    sort: rest.sort,
    type: rest.type,
    condition: rest.condition,
    minPrice: rest.minPrice,
    maxPrice: rest.maxPrice,
    inStock: rest.inStock,
  });

  const res = await sdk.getApiProducts({
    client: api,
    query,
    signal,
  });

  if (res.error) throw res.error;

  return (
    res.data ?? {
      items: [],
      page,
      pageSize,
      totalItems: 0,
      totalPages: 0,
    }
  );
}

export async function getProductById(id: number): Promise<ProductDto> {
  const res = await sdk.getApiProductsById({
    client: api,
    path: { id },
  });

  if (res.error) throw res.error;
  return res.data!;
}

export async function suggestProducts(
  q: string,
  take = 8
): Promise<ProductSuggestionDto[]> {
  const query = q.trim();
  if (!query) return [];

  const res = await sdk.getApiProductsSuggest({
    client: api,
    query: { q: query, take },
  });

  if (res.error) throw res.error;
  return res.data ?? [];
}