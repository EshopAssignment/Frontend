import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type * as apiTypes from "@/api/types.gen";
import { asNum } from "@/helpers/money";

export type AdminProduct = Omit<
  apiTypes.ProductDto,
  "id" | "priceExVat" | "vatRatePercent" | "onHand" | "reserved" | "available"
> & {
  id: number;
  priceExVat: number;
  vatRatePercent: number;
  onHand: number;
  reserved: number;
  available: number;
};

export type AdminPagedProducts = Omit<apiTypes.PagedResultOfProductDto, "items"> & {
  items: AdminProduct[];
};

export type AdminCreateReq = apiTypes.AdminCreateProductRequestDto;
export type AdminUpdateReq = apiTypes.AdminUpdateProductRequestDto;
export type ToggleActiveReq = apiTypes.ToggleActiveRequest;

export type AdminProductListParams = {
  page?: number;
  pageSize?: number;
  query?: string;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "popular";
  type?: string[];
  condition?: string[];
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
};

function toAdminProduct(product: apiTypes.ProductDto): AdminProduct {
  return {
    ...product,
    id: asNum(product.id, 0),
    priceExVat: asNum(product.priceExVat, 0),
    vatRatePercent: asNum(product.vatRatePercent, 25),
    onHand: asNum(product.onHand, 0),
    reserved: asNum(product.reserved, 0),
    available: asNum(product.available, 0),
  };
}

export async function adminListProducts(
  params: AdminProductListParams = {}
): Promise<AdminPagedProducts> {
  const res = await sdk.getApiAdminProducts({ client: api, query: params });
  if (res.error) throw res.error;

  const data =
    res.data ?? {
      items: [],
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      totalItems: 0,
      totalPages: 0,
    };

  return {
    ...data,
    items: (data.items ?? []).map(toAdminProduct),
  };
}

export async function adminGetProduct(id: number): Promise<AdminProduct> {
  const res = await sdk.getProductByIdAdmin({ client: api, path: { id } });
  if (res.error) throw res.error;
  return toAdminProduct(res.data!);
}

export async function adminCreateProduct(body: AdminCreateReq): Promise<AdminProduct> {
  const res = await sdk.postApiAdminProducts({ client: api, body });
  if (res.error) throw res.error;
  return toAdminProduct(res.data!);
}

export async function adminUpdateProduct(id: number, body: AdminUpdateReq): Promise<AdminProduct> {
  const res = await sdk.putApiAdminProductsById({ client: api, path: { id }, body });
  if (res.error) throw res.error;
  return toAdminProduct(res.data!);
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