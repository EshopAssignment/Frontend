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