import { useEffect, useMemo, useState } from "react";
import loadingIcon from "../../images/loading.png";
import { useSearchParams } from "react-router-dom";
import { getProductsPaged, type PagedProducts, type ProductDto } from "@/Services/productService";
import FilterBar from "../../components/FilterBar";
import ItemCard from "../../components/ItemCard";
import RequestOrder from "../../components/Orders/RequestOrder";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ViewModeBtn from "@/components/Buttons/ViewModeBtn";
import ProductListView from "@/components/Product/ProductListView";

const PAGE_SIZE = 15;

type ViewMode = "grid" | "list";

const ProductPage = () => {
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>(()=> {
    const saved = localStorage.getItem("productViewMode")
    return saved === "list" ? "list" : "grid"
  }); 


  const params = useMemo(() => {
    const q = searchParams.get("q") ?? "";
    const sort = searchParams.get("sort") ?? "";

    const type = searchParams.getAll("type").sort();
    const condition = searchParams.getAll("condition").sort();

    const minStr = searchParams.get("minPrice");
    const maxStr = searchParams.get("maxPrice");

    const minParsed = minStr != null ? Number(minStr) : undefined;
    const maxParsed = maxStr != null ? Number(maxStr) : undefined;

    const min = Number.isFinite(minParsed as number) ? (minParsed as number) : undefined;
    const max = Number.isFinite(maxParsed as number) ? (maxParsed as number) : undefined;

    const inStock = searchParams.get("inStock") === "true";

    

    return {
      q: q || undefined,
      sort: sort || undefined,
      type: type.length ? type : undefined,
      condition: condition.length ? condition : undefined,
      min,
      max,
      inStock,
      keyParts: [
        q || "",
        sort || "",
        type.join(","),
        condition.join(","),
        minStr ?? "",
        maxStr ?? "",
        String(inStock),
      ] as const,
    };
  }, [searchParams]);


  useEffect(() => {
    setPage(1);
  }, [
    params.q,
    params.sort,
    JSON.stringify(params.type),
    JSON.stringify(params.condition),
    params.min,
    params.max,
    params.inStock,
  ]);
  useEffect(() => {
    localStorage.setItem("productViewMode", viewMode);
  }, [viewMode]);

  const { data, isLoading, isError, error, isFetching } = useQuery<PagedProducts>({
    queryKey: ["products", "paged", PAGE_SIZE, page, ...params.keyParts],
    queryFn: ({ signal }) =>
      getProductsPaged(page, PAGE_SIZE, {
        signal,
        query: params.q,
        sort: params.sort as any,
        type: params.type,
        condition: params.condition,
        minPrice: params.min,
        maxPrice: params.max,
        inStock: params.inStock, 
      }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  const products: ProductDto[] = data?.items ?? [];
  const totalPages = Math.max(
    1,
    Number.isFinite(Number(data?.totalPages)) ? Number(data?.totalPages) : 1
  );

  const nextPage = () => {
    if (!isFetching && page < totalPages) setPage((p) => p + 1);
  };
  const prevPage = () => {
    if (!isFetching && page > 1) setPage((p) => p - 1);
  };
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
                {products.map(p => (
                  <ItemCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="product-list">
                {products.map(p => (
                  <ProductListView key={p.id} product={p} />
                ))}
              </div>
            )}

          <div className="pagination">
            <button onClick={prevPage} disabled={page === 1 || isFetching}>
              {"<"}
            </button>

            <span>
              Sida {page} av {totalPages} {isFetching ? " (uppdaterar…)" : ""}
            </span>

            <button onClick={nextPage} disabled={page === totalPages || isFetching}>
              {">"}
            </button>
          </div>
        </div>

        <div className="divider"></div>
      </div>

      <RequestOrder />
    </section>
  );
};

export default ProductPage;
