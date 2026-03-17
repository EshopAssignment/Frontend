export type AdminProductFilterDraft = {
  sort: "" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
  type: string[];
  condition: string[];
  minPrice: string;
  maxPrice: string;
  isActive: "" | "true" | "false";
};

export function readAdminDraftFromSearchParams(
  searchParams: URLSearchParams
): AdminProductFilterDraft {
  return {
    sort: (searchParams.get("sort") as AdminProductFilterDraft["sort"]) ?? "",
    type: searchParams.getAll("type"),
    condition: searchParams.getAll("condition"),
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    isActive: (searchParams.get("isActive") as AdminProductFilterDraft["isActive"]) ?? "",
  };
}

export function writeAdminDraftToSearchParams(
  current: URLSearchParams,
  draft: AdminProductFilterDraft
) {
  const next = new URLSearchParams(current);

  next.delete("page");
  next.delete("sort");
  next.delete("type");
  next.delete("condition");
  next.delete("minPrice");
  next.delete("maxPrice");
  next.delete("isActive");

  if (draft.sort) next.set("sort", draft.sort);
  for (const value of draft.type) next.append("type", value);
  for (const value of draft.condition) next.append("condition", value);
  if (draft.minPrice) next.set("minPrice", draft.minPrice);
  if (draft.maxPrice) next.set("maxPrice", draft.maxPrice);
  if (draft.isActive) next.set("isActive", draft.isActive);

  return next;
}

export function clearAdminFilters(current: URLSearchParams) {
  const next = new URLSearchParams(current);

  next.delete("page");
  next.delete("sort");
  next.delete("type");
  next.delete("condition");
  next.delete("minPrice");
  next.delete("maxPrice");
  next.delete("isActive");

  return next;
}