import type { CartItem } from "@/context/CartContext";
import type { ProductDto } from "../Services/productService";
import { buildImageUrl } from "./url";

export function toCartItem(p: ProductDto): Omit<CartItem, "quantity"> {
  const productId = Number(p.id);
  const priceExVat = Number(p.priceExVat);
  const vatRatePercent = Number((p as any).vatRatePercent);
  return {
    productId: Number.isFinite(productId) ? productId : 0,
    name: String(p.name ?? ""),
    priceExVat: Number.isFinite(priceExVat) ? priceExVat : 0,
    vatRatePercent: Number.isFinite(vatRatePercent) ? vatRatePercent : 25,
    imgUrl: buildImageUrl(p.imgUrl) ?? "",
  };
}
