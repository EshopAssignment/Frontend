import { api } from '@/lib/http';
import * as sdk from '@/api/sdk.gen';

export type PagedProducts = NonNullable<
  Awaited<ReturnType<typeof sdk.getApiProducts>>['data']
>;
export type ProductDto = NonNullable<PagedProducts['items']>[number];
export type ProductSuggestionDto =
  NonNullable<Awaited<ReturnType<typeof sdk.getApiProductsSuggest>>['data']>[number];
type SortUi = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | undefined;




function defined<T extends object>(o: T): Partial<T> {
  const out: any = {};
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (Number.isNaN(v)) continue;
    out[k] = v;
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
  } = {}
): Promise<PagedProducts> {
  const { signal, sort, ...rest } = opts;

  const query = defined({
    page,
    pageSize,
    query: rest.query,
    sort,
    type: rest.type,
    condition: rest.condition,
    minPrice: rest.minPrice,
    maxPrice: rest.maxPrice,
  });

  const res = await sdk.getApiProducts({ client: api, query, signal });

  if ('response' in res && !res.response.ok) {
    const text = await res.response.text().catch(() => '');
    throw new Error(`Failed to fetch products: ${res.response.status} ${text}`);
  }
  return res.data!;
}

export async function getProductById(id: number): Promise<ProductDto> {
  const res = await sdk.getApiProductsById({ client: api, path: { id } });
  if ('response' in res && !res.response.ok) {
    const text = await res.response.text().catch(() => '');
    throw new Error(`Not Found: ${res.response.status} ${text}`);
  }
  return res.data!;
}

export async function suggestProducts(q: string, take = 8): Promise<ProductSuggestionDto[]> {
  const qq = q.trim();
  if (!qq) return [];
  const res = await sdk.getApiProductsSuggest({ client: api, query: { q: qq, take } });
  if ('response' in res && !res.response.ok) {
    const text = await res.response.text().catch(() => '');
    throw new Error(`Suggest failed: ${res.response.status} ${text}`);
  }
  return res.data ?? [];
}
