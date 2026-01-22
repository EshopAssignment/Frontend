import { useMemo } from "react";
import loadingIcon from "../../images/loading.png";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../../components/FilterBar";
import ItemCard from "../../components/ItemCard";
import RequestOrder from "../../components/Orders/RequestOrder";
import ViewModeBtn from "@/components/Buttons/ViewModeBtn";
import ProductListView from "@/components/Product/ProductListView";

import { parseProductFilters } from "@/helpers/productFilters";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { usePagedState } from "@/hooks/usePagedState";
import { useProductsPaged } from "@/queries/products/useProductsPaged";

const PAGE_SIZE = 15;
type ViewMode = "grid" | "list";

export default function ProductPage() {
  const [searchParams] = useSearchParams();

  const filters = useMemo(() => parseProductFilters(searchParams), [searchParams]);

  const [viewMode, setViewMode] = useLocalStorageState<ViewMode>(
    "productViewMode",
    "grid",
    (raw) => (raw === "list" ? "list" : "grid")
  );

  const [page, setPage] = usePagedState(filters.key);

  const { data, isLoading, isError, error, isFetching } =
    useProductsPaged(page, PAGE_SIZE, filters);

  const products = data?.items ?? [];
  const totalPages = Math.max(1, Number(data?.totalPages) || 1);

  const nextPage = () => !isFetching && page < totalPages && setPage(p => p + 1);
  const prevPage = () => !isFetching && page > 1 && setPage(p => p - 1);

  if (isLoading && !data) {
    return (
      <section className="container loading-msg">
        <p>Hold on, pallets are stacking</p>
        <img src={loadingIcon} alt="loading" className="loading-icon" />
      </section>
    );
  }

  return (
    <section>
      <div className="container">
        <div className="product-toolbar">
          <FilterBar />
          <ViewModeBtn value={viewMode} onChange={setViewMode} />
        </div>

        <div className="items">
          {isError && (
            <p className="error">
              {(error as Error)?.message ?? "Kunde inte hämta produkter"}
            </p>
          )}

          {viewMode === "grid" ? (
            <div className="item-card-container">
              {products.map((p) => <ItemCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="product-list">
              {products.map((p) => <ProductListView key={p.id} product={p} />)}
            </div>
          )}

          <div className="pagination">
            <button onClick={prevPage} disabled={page === 1 || isFetching}>{"<"}</button>
            <span>Sida {page} av {totalPages}{isFetching ? " (uppdaterar…)" : ""}</span>
            <button onClick={nextPage} disabled={page === totalPages || isFetching}>{">"}</button>
          </div>
        </div>

        <div className="divider"></div>
      </div>

      <RequestOrder />
    </section>
  );
}
