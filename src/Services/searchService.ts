export type ProductSuggestion = {
    id: number;
    name:string;
    price:number;
    imgUrl:string;
    slug?:string | null;
    sku?:string | null;
};

export async function suggestProducts(q: string, take = 8): Promise<ProductSuggestion[]> {
    if (!q.trim()) return [];
    const base = import.meta.env.VITE_API_URL;
    const url = `${base}/api/Products/suggest?q=${encodeURIComponent(q)}&take=${take}`;
    const res = await fetch (url)
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json();
}