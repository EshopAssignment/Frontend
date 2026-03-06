import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import { asNum, clampVatRatePercent } from "@/helpers/money";

export type ProductDto = {
  id: number;
  name: string;
  description: string;

  primaryImgUrl: string;
  images: ProductImageDto[];

  priceExVat: number;         
  vatRatePercent: number;

  palletType: string;
  condition: string;
  stockStatus: string;

  onHand: number;
  reserved: number;
  available: number;

  isActive: boolean;
  sku: string | null;
  slug: string | null;
};

export type ProductImageDto = {
  url: string;
  sortOrder: number;
  isPrimary: boolean;
  altText?: string | null;
};

export type AdminProduct = ProductDto;

export type AdminPagedProducts = {
  items: AdminProduct[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type EnumOption = { value: string; label: string; intValue: number };

export type AdminProductOptions = {
  productTypes: EnumOption[];
  productConditions: EnumOption[];
  vatRates: EnumOption[];
};

export type AdminCreateReq =
  NonNullable<Parameters<typeof sdk.postApiAdminProducts>[0]>["body"];

export type AdminUpdateReq =
  NonNullable<Parameters<typeof sdk.putApiAdminProductsById>[0]>["body"];



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
}): Promise<AdminPagedProducts> {
  const res = await sdk.getApiAdminProducts({ client: api, query: params });
  if (res.error) throw res.error;

  const d: any = res.data ?? {};
  const items = Array.isArray(d.items) ? d.items.map(mapProduct) : [];

  const page = asNum(d.page ?? d.currentPage ?? params.page ?? 1, 1);
  const pageSize = asNum(d.pageSize ?? d.perPage ?? params.pageSize ?? 20, 20);
  const totalItems = asNum(d.totalItems ?? d.total ?? items.length, items.length);
  const totalPages =
    Number.isFinite(d?.totalPages)
      ? Number(d.totalPages)
      : Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));

  return { items, page, pageSize, totalItems, totalPages };
}

export async function adminListProducts(page: number, pageSize: number): Promise<AdminPagedProducts> {
  return adminListProductsQuery({ page, pageSize });
}

export async function adminGetProduct(id: number): Promise<AdminProduct> {
  const res = await sdk.getProductByIdAdmin({ client: api, path: { id } });
  if (res.error) throw res.error;
  return mapProduct(res.data);
}

export async function adminCreateProduct(body: AdminCreateReq): Promise<AdminProduct> {
  const res = await sdk.postApiAdminProducts({ client: api, body });
  if (res.error) throw res.error;
  return mapProduct(res.data);
}

export async function adminUpdateProduct(id: number, body: AdminUpdateReq): Promise<AdminProduct> {
  const res = await sdk.putApiAdminProductsById({ client: api, path: { id }, body });
  if (res.error) throw res.error;
  return mapProduct(res.data);
}

export async function adminToggleActive(id: number, isActive: boolean): Promise<void> {
  if ("patchApiAdminProductsByIdActivate" in sdk) {
    const res = await (sdk as any).patchApiAdminProductsByIdActivate({
      client: api,
      path: { id },
      body: { isActive },
    });
    if (res.error) throw res.error;
    return;
  }

  if ("patchApiAdminProductsByIdActive" in sdk) {
    const res = await (sdk as any).patchApiAdminProductsByIdActive({
      client: api,
      path: { id },
      body: { isActive },
    });
    if (res.error) throw res.error;
    return;
  }

  throw new Error("Toggle endpoint saknas i SDK. Kontrollera OpenAPI och regenerera.");
}

export async function adminGetProductOptions(): Promise<AdminProductOptions> {
  const res = await sdk.getApiAdminProductsOptions({ client: api });
  if (res.error) throw res.error;

  const data = (res.data ?? {}) as {
    productTypes?: unknown[];
    productConditions?: unknown[];
    vatRates?: unknown[];
  };

  const sanitize = (xs: unknown[] | undefined): EnumOption[] =>
    Array.isArray(xs)
      ? xs.map((x) => {
          const anyx = x as any;
          return {
            value: String(anyx?.value ?? ""),
            label: String(anyx?.label ?? ""),
            intValue: asNum(anyx?.intValue ?? anyx?.value, 0),
          };
        })
      : [];

  return {
    productTypes: sanitize(data.productTypes),
    productConditions: sanitize(data.productConditions),
    vatRates: sanitize(data.vatRates),
  };
}
//Helpers
function mapProduct(raw: unknown): AdminProduct {
  const r = (raw ?? {}) as any;

  const images: ProductImageDto[] = Array.isArray(r.images)
    ? r.images.map((x: any) => ({
        url: String(x?.url ?? ""),
        sortOrder: asNum(x?.sortOrder, 0),
        isPrimary: Boolean(x?.isPrimary),
        altText: x?.altText ?? null,
      })).filter((x: ProductImageDto) => x.url)
    : [];

  const primary =
    String(r.primaryImgUrl ?? "") ||
    String(r.imgUrl ?? "") ||
    images.slice().sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0) || a.sortOrder - b.sortOrder)[0]?.url ||
    "";

  const normalized = normalizeImages(images, primary);

  return {
    id: asNum(r.id, 0),
    name: String(r.name ?? ""),
    description: String(r.description ?? ""),
    primaryImgUrl: normalized.primaryUrl,
    images: normalized.images,
    priceExVat: asNum(r.priceExVat, 0),
    vatRatePercent: clampVatRatePercent(r.vatRatePercent, 25),

    palletType: String(r.palletType ?? ""),
    condition: String(r.condition ?? ""),
    stockStatus: String(r.stockStatus ?? ""),

    onHand: asNum(r.onHand, 0),
    reserved: asNum(r.reserved, 0),
    available: asNum(r.available, 0),

    isActive: Boolean(r.isActive),
    sku: r.sku ?? null,
    slug: r.slug ?? null,
  };
}

function normalizeImages(images: ProductImageDto[], fallbackPrimaryUrl: string) {
  const list = images
    .filter(i => i.url)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  for (let i = 0; i < list.length; i++) list[i].sortOrder = i;

  if (list.length === 0 && fallbackPrimaryUrl) {
    list.push({ url: fallbackPrimaryUrl, sortOrder: 0, isPrimary: true, altText: null });
  }

  if (list.length > 0) {
    const idx = Math.max(0, list.findIndex(x => x.isPrimary));
    list.forEach((x, i) => (x.isPrimary = i === (idx === -1 ? 0 : idx)));
  }

  const primaryUrl = list.find(x => x.isPrimary)?.url ?? list[0]?.url ?? "";
  return { images: list, primaryUrl };
}