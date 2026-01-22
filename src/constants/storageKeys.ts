export const STORAGE_THEME = "pallshoppen:theme:v1";
export const STORAGE_COOKIES = "pallshoppen:cookiePrefs:v1";
export const PRODUCT_FILTER_KEYS = [
  "sort",
  "type",
  "condition",
  "inStock",
  "minPrice",
  "maxPrice",
] as const;
export type ProductFilterKey = typeof PRODUCT_FILTER_KEYS[number];