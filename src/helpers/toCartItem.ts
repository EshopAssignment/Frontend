import type { ProductDto } from "../Services/productService";

export const toCartItem = (p: ProductDto) => ({
  productId: p.id,
  name: p.name,
  price: p.price,
  imgUrl: p.imgUrl
});
