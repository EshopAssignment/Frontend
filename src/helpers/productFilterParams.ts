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