import type { PagedResult, ProductDto } from "./productService";

const ADMIN_URL = "https://localhost:7152/api/admin/products";


export async function AdminListProducts(page =1, pageSize = 20) {
    const res = await fetch(`${ADMIN_URL}?page=${page}&pageSize=${pageSize}`);

    if(!res.ok) throw new Error("Failed to fetch");
    return res.json () as Promise<PagedResult<ProductDto>>;
}

export async function adminGetProduct(id: number) {
    const res = await fetch(`${ADMIN_URL}/${id}`);

    if(!res.ok) throw new Error("Not Found");
    return res.json () as Promise<ProductDto>;
}

export type AdminCreateReq = {
    name: string;
    description: string;
    palletType: string;
    condition: string;
    imgUrl?: string;
    price: number;
    stockQuantity: number;
    isActive: boolean;
};

export type AdminUpdateReq = AdminCreateReq;

export async function adminCreateProduct(body: AdminCreateReq) {
    const res = await fetch(ADMIN_URL, ({
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    }));
    if (!res.ok) throw new Error("Create Failed");
    return res.json () as Promise<ProductDto>
}

export async function adminUpdateProduct(id: number, body: AdminUpdateReq) {
  const res = await fetch(`${ADMIN_URL}/${id}`, ({
    method: "PUT",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(body),
  }));
  if (!res.ok) throw new Error("Update failed");
  return res.json() as Promise<ProductDto>;
}

export async function adminToggleActive(id: number, isActive: boolean) {
  const res = await fetch(`${ADMIN_URL}/${id}/activate`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ isActive }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Toggle failed: ${res.status} ${text}`);
  }
}

export async function adminUploadImage(id: number, file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${ADMIN_URL}/${id}/image`, ({ method: "PUT", body: form }));
      if (!res.ok) throw new Error("Upload failed");
      return res.json() as Promise <{ imgUrl: string}>;
}