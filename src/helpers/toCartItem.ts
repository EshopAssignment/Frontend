import type { CartItem } from "@/context/CartContext";
import type { ProductDto } from "../Services/productService";
import { buildImageUrl } from "./url";

export function toCartItem(p: ProductDto): Omit<CartItem, "quantity"> {
  const productId = Number((p as any).id);
  const priceExVat = Number((p as any).priceExVat);
  return {
    productId: Number.isFinite(productId) ? productId : 0,
    name: String(p.name ?? ""),
    priceExVat: Number.isFinite(priceExVat) ? priceExVat : 0,
    imgUrl: buildImageUrl(p.imgUrl) ?? "",
  };
}
