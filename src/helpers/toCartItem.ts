import type { CartItem } from "@/context/CartContext";
import type { ProductDto } from "../Services/productService";
import { resolveImageUrl } from "./ImageHelpers";
import { asNum } from "./money";

export function toCartItem(p: ProductDto): Omit<CartItem, "quantity"> {
  const productId = Number(p.id);
  const priceExVat = Number(p.priceExVat);
  const vatRatePercent = asNum(p.vatRatePercent);
  const imgUrl = resolveImageUrl(p.primaryImgUrl) || "";
  return {
    productId: Number.isFinite(productId) ? productId : 0,
    name: String(p.name ?? ""),
    priceExVat: Number.isFinite(priceExVat) ? priceExVat : 0,
    vatRatePercent: Number.isFinite(vatRatePercent) ? vatRatePercent : 25,
    imgUrl,
  };
}
