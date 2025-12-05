import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";


export type AdminProduct = {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  priceExVat: number;
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

export type AdminPagedProducts = {
  items: AdminProduct[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};


export type AdminCreateReq =
  NonNullable<Parameters<typeof sdk.postApiAdminProducts>[0]>["body"];

export type AdminUpdateReq =
  NonNullable<Parameters<typeof sdk.putApiAdminProductsById>[0]>["body"];

const asNum = (v: unknown, fb = 0) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fb;
};

function mapProduct(raw: any): AdminProduct {
  return {
    id: asNum(raw.id, 0),
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    imgUrl: String(raw.imgUrl ?? ""),
    priceExVat: asNum(raw.priceExVat, 0),
    palletType: String(raw.palletType ?? ""),
    condition: String(raw.condition ?? ""),
    stockStatus: String(raw.stockStatus ?? ""),
    onHand: asNum(raw.onHand, 0),
    reserved: asNum(raw.reserved, 0),
    available: asNum(raw.available, 0),
    isActive: Boolean(raw.isActive),
    sku: raw.sku ?? null,
    slug: raw.slug ?? null,
  };
}


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
    Number.isFinite(d?.totalPages) ? Number(d.totalPages)
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


export async function adminUploadImage(id: number, file: File): Promise<{ imgUrl: string }> {
  const form = new FormData();
  form.append("file", file);

  const candidates = [
    "putApiAdminProductsByIdImage",
    "postApiAdminProductsByIdImage",
    "patchApiAdminProductsByIdImage",
  ] as const;

  for (const fn of candidates) {
    if (fn in sdk) {
      const res = await (sdk as any)[fn]({ client: api, path: { id }, body: form });
      if (res.error) throw res.error;
      return (res.data ?? { imgUrl: "" }) as { imgUrl: string };
    }
  }

  throw new Error("Image-upload endpoint saknas i SDK. Kontrollera OpenAPI och regenerera.");
}
