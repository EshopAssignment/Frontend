import type { CartItem } from "@/context/CartContext";
import type { ProductDto } from "../Services/productService";
import { asNum, clampVatRatePercent } from "./money";

export function toCartItem(p: ProductDto): Omit<CartItem, "quantity"> {
  return {
    productId: Number(p.id),
    name: p.name ?? "",
    priceExVat: asNum(p.priceExVat, 0),
    vatRatePercent: clampVatRatePercent(p.vatRatePercent, 25),
    thumbUrl: p.primaryImgUrl ?? undefined,
  };
}