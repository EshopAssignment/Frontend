import { useEffect, useState } from "react";
import loadingIcon from "../../images/loading.png";
import { useSearchParams } from "react-router-dom";
import { getProductsPaged, type ProductDto } from "../../Services/productService";
import FilterBar from "../../components/FilterBar";
import ItemCard from "../../components/ItemCard";
import RequestOrder from "../../components/Orders/RequestOrder";


const PAGE_SIZE = 15;

const ProductPage = () => {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";
    const sort = searchParams.get("sort") ?? "";
    const type = searchParams.getAll("type");
    const condition = searchParams.getAll("condition");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

useEffect(() => {
  const controller = new AbortController();
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsPaged(page, PAGE_SIZE, {
        signal: controller.signal,
        query,
        sort,
        type,
        condition,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });
      setProducts(data.items);
      setTotalPages(Math.max(1, data.totalPages || 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error(err);
        setError("Kunde inte hämta produkter.");
        setProducts([]);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
    }
  };
  load();
  return () => controller.abort();
}, [page, query, sort, type.join(","), condition.join(","), minPrice, maxPrice]);

useEffect(() => {
  setPage(1);
}, [query, sort, type.join(","), condition.join(","), minPrice, maxPrice]);


  useEffect(() => {
    setPage(1);
  }, [query]);


  const nextPage = () => !loading && page < totalPages && setPage(p => p + 1);
  const prevPage = () => !loading && page > 1 && setPage(p => p - 1);


  if (loading) {
    return (
      <section className="container loading-msg">
        <p>Hold on, pallets are stacking</p>
        <img src={loadingIcon} alt="loading" className="loading-icon" />
      </section>
    );
  }

  return (
    <>
    <section>
      <div className="container">
        
        <FilterBar />
        <div className="items">

          {error && <p className="error">{error}</p>}

          {query && <p className="search-hint">Sökresultat för: “{query}”</p>}

          <div className="item-card-container">
            {products.length === 0 ? (
              <p>Inga matchande produkter.</p>
            ) : (
              products.map(p => <ItemCard key={p.id} product={p} />)
            )}
          </div>

          <div className="pagination">
            <button onClick={prevPage} disabled={page === 1}>{"<"}</button>
            <span>Sida {page} av {totalPages}</span>
            <button onClick={nextPage} disabled={page === totalPages}>{">"}</button>
          </div>

        </div>

        <div className="divider"></div>
      </div>
    </section>
    <section>
        <RequestOrder />
    </section>
    </>

  );
};

export default ProductPage;
