export interface ProductDto{
    id: number
    name: string
    description: string
    palletType: string
    condition: string
    price: number
    stockQuantity: number
    imgUrl: string
    isActive: boolean
}

export interface PagedResult<T> {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    items: T[];
}

const API_URL = "https://localhost:7152/api/Products"

export async function getProducts(): Promise<ProductDto[]> {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
}

export async function getProduct(id: number): Promise<ProductDto> {
    const res = await fetch(`${API_URL}/${id}`)
    if (!res.ok) throw new Error("Product Not Found");

    const data: ProductDto = await res.json();
        return data;
}

export async function getProductsPaged(
    page: number,
    pageSize: number,
    init?: RequestInit & {
        query?: string;
        sort?: string;
        type? : string[];
        condition?: string[];
        minPrice?: number;
        maxPrice?: number;
        }
): Promise<PagedResult<ProductDto>> {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    if (init?.query) params.set("query", init.query);
      if (init?.sort) params.set("sort", init.sort);
        init?.type?.forEach(t => params.append("type", t));
        init?.condition?.forEach(c => params.append("condition", c));
        if (typeof init?.minPrice === "number") params.set("minPrice", String(init.minPrice));
        if (typeof init?.maxPrice === "number") params.set("maxPrice", String(init.maxPrice));


    const res = await fetch(`${API_URL}?${params.toString()}`, {
        ...init,
        headers: {"Content-Type": "application/json",...(init?.headers || {})},
    });
    if(!res.ok) throw new Error("Failed to fetch paged products");
    return res.json();

}