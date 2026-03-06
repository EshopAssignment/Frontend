import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type * as apiTypes from "@/api/types.gen";

export type AdminCreateReq = apiTypes.AdminCreateProductRequestDto;
export type AdminUpdateReq = apiTypes.AdminUpdateProductRequestDto;
export type ToggleActiveReq = apiTypes.ToggleActiveRequest;

export async function adminListProductsQuery(params: {
  page?: number;
  pageSize?: number;
  query?: string;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
  type?: string[];
  condition?: string[];
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}): Promise<apiTypes.PagedResultOfProductDto> {
  const res = await sdk.getApiAdminProducts({ client: api, query: params });
  if (res.error) throw res.error;

  return (
    res.data ?? {
      items: [],
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      totalItems: 0,
      totalPages: 0,
    }
  );
}

export async function adminListProducts(
  page: number,
  pageSize: number
): Promise<apiTypes.PagedResultOfProductDto> {
  return adminListProductsQuery({ page, pageSize });
}

export async function adminGetProduct(id: number): Promise<apiTypes.ProductDto> {
  const res = await sdk.getProductByIdAdmin({ client: api, path: { id } });
  if (res.error) throw res.error;
  return res.data!;
}

export async function adminCreateProduct(body: AdminCreateReq): Promise<apiTypes.ProductDto> {
  const res = await sdk.postApiAdminProducts({ client: api, body });
  if (res.error) throw res.error;
  return res.data!;
}

export async function adminUpdateProduct(id: number, body: AdminUpdateReq): Promise<apiTypes.ProductDto> {
  const res = await sdk.putApiAdminProductsById({ client: api, path: { id }, body });
  if (res.error) throw res.error;
  return res.data!;
}

export async function adminToggleActive(id: number, isActive: boolean): Promise<void> {
  const body: ToggleActiveReq = { isActive };

  const res = await sdk.patchApiAdminProductsByIdActivate({
    client: api,
    path: { id },
    body,
  });

  if (res.error) throw res.error;
}

export async function adminGetProductOptions(): Promise<apiTypes.AdminProductOptionsDto> {
  const res = await sdk.getApiAdminProductsOptions({ client: api });
  if (res.error) throw res.error;

  return (
    res.data ?? {
      productTypes: [],
      productConditions: [],
      vatRates: [],
    }
  );
}