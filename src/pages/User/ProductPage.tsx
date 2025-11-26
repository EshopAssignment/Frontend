import { useEffect, useMemo, useState } from "react";
import loadingIcon from "../../images/loading.png";
import { useSearchParams } from "react-router-dom";
import { getProductsPaged, type ProductDto } from "../../Services/productService";
import FilterBar from "../../components/FilterBar";
import ItemCard from "../../components/ItemCard";
import RequestOrder from "../../components/Orders/RequestOrder";
import { useQuery } from "@tanstack/react-query";
import type { PagedResult } from "../../Services/productService";

const PAGE_SIZE = 15;

const ProductPage = () => {

  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const type = searchParams.getAll("type");
  const condition = searchParams.getAll("condition");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  
  const filters = useMemo(() => ({
    query, sort,
    typeKey: [...type].slice().sort().join(","),
    conditionKey: condition.slice().sort().join(","),
    minPriceNum: minPrice ? Number(minPrice) : undefined,
    maxPriceNum: maxPrice ? Number(maxPrice) : undefined
  }), [query, sort, type, condition, minPrice, maxPrice]);

  useEffect(() => {
    setPage(1);
  }, [filters.query, filters.sort, filters.typeKey, filters.conditionKey, filters.minPriceNum, filters.maxPriceNum]);


  const { data, isLoading, isError, error, isFetching } = useQuery<
    PagedResult<ProductDto>,               
    Error,                                
    PagedResult<ProductDto>,              
    [string, string, number, number, {     
      query: string;
      sort: string;
      typeKey: string;
      conditionKey: string;
      minPriceNum?: number;
      maxPriceNum?: number;
    }]
  >({
    queryKey: ["products", "paged", page, PAGE_SIZE, filters],
    queryFn: ({ signal }) =>
      getProductsPaged(page, PAGE_SIZE, {
        signal,
        query: filters.query,
        sort: filters.sort,
        type,
        condition,
        minPrice: filters.minPriceNum,
        maxPrice: filters.maxPriceNum,
      }),
    placeholderData: (prev) => prev,

    staleTime: 10_000,
  });

  const products: ProductDto[] = data?.items ?? [];
  const totalPages: number = Math.max(1, data?.totalPages ?? 1);

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
          <FilterBar />
          <div className="items">
            {isError && <p className="error"> {(error as Error)?.message ?? "Kunde inte hämta prdukter"}</p>}
            {filters.query && <p className="search-hint">Sökresultat för: “{filters.query}”</p>}

            <div className="item-card-container">
              {products.length === 0 ? (
                <p>Inga matchande produkter.</p>
              ) : (
                products.map(p => <ItemCard key={p.id} product={p} />)
              )}
            </div>

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
