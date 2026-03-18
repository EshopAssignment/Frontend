import { PRODUCT_FILTER_KEYS } from "@/constants/storageKeys";

export type ProductFilterDraft = {
    sort: string;
    type: string[];
    condition: string[];
    inStock: boolean;
    minPrice: string;
    maxPrice:string;
};

export function readDraftFromSearchParams(sp:URLSearchParams): ProductFilterDraft {
    return {
        sort: sp.get("sort") ?? "",
        type: sp.getAll("type"),
        condition: sp.getAll("condition"),
        inStock: sp.get("inStock") === "true",
        minPrice: sp.get("minPrice") ?? "",
        maxPrice: sp.get("maxPrice") ?? "",
    };
}

export function writeDraftToSearchParams(sp: URLSearchParams, draft: ProductFilterDraft): URLSearchParams {
    const next = new URLSearchParams(sp);

    next.delete("page");

    if (draft.sort) next.set("sort", draft.sort);
    else next.delete("sort");

    next.delete("type");
    draft.type.forEach(t => next.append("type", t));

    next.delete("condition");
    draft.condition.forEach(c => next.append("condition", c));

    if (draft.inStock) next.set("inStock", "true");
    else next.delete("inStock");

    if (draft.minPrice) next.set("minPrice", draft.minPrice);
    else next.delete("minPrice");

    if (draft.maxPrice) next.set("maxPrice", draft.maxPrice);
    else next.delete("maxPrice");

    return next;
}

export function clearAllFilters(sp: URLSearchParams): URLSearchParams {
    const next = new URLSearchParams(sp);
    PRODUCT_FILTER_KEYS.forEach((k) => next.delete(k));
    return next;
}

import type { SortUi } from "@/Services/productService";

export type ProductFilters = {
  q?: string;
  sort?: SortUi;
  type?: string[];
  condition?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  key: string; 
};

const SORT_VALUES: ReadonlyArray<SortUi> = [
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
];

function parseSort(raw: string | null): SortUi | undefined {
  if (!raw) return undefined;
  return (SORT_VALUES as readonly string[]).includes(raw) ? (raw as SortUi) : undefined;
}

export function parseProductFilters(sp: URLSearchParams): ProductFilters {
  const qRaw = (sp.get("q") ?? "").trim();
  const sort = parseSort(sp.get("sort"));

  const type = sp.getAll("type").map(s => s.trim()).filter(Boolean).sort();
  const condition = sp.getAll("condition").map(s => s.trim()).filter(Boolean).sort();

  const minStr = sp.get("minPrice");
  const maxStr = sp.get("maxPrice");

  const minParsed = minStr != null ? Number(minStr) : undefined;
  const maxParsed = maxStr != null ? Number(maxStr) : undefined;

  const minPrice = Number.isFinite(minParsed as number) ? minParsed : undefined;
  const maxPrice = Number.isFinite(maxParsed as number) ? maxParsed : undefined;

  const q = qRaw || undefined;
  const inStock = sp.get("inStock") === "true";

  const key = [
    qRaw,
    sort ?? "",
    type.join(","),
    condition.join(","),
    minStr ?? "",
    maxStr ?? "",
    String(inStock),
  ].join("|");

  return {
    q,
    sort,
    type: type.length ? type : undefined,
    condition: condition.length ? condition : undefined,
    minPrice,
    maxPrice,
    inStock,
    key,
  };
}
