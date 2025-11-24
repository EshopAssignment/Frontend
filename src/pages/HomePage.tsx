import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
import { getProducts, getProductsPaged, type ProductDto } from "../Services/productService";
import loadingIcon from "../images/loading.png";

const HomePage = () => {
  const [products, setProducts] = useState<ProductDto[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

useEffect(() => {
  getProductsPaged(page, 5)
    .then(data => {
      setProducts(data.items);
      setTotalPages(data.totalPages);
    })
    .finally(() => setLoading(false));
}, [page]);

const nextPage = () => page < totalPages && setPage(page + 1);
const prevPage = () => page > 1 && setPage(page - 1);


  if (loading) {
    return (
      <section className="container loading-msg">
        <p className="">Hold on, pallets are stacking</p>
        <img
          src={loadingIcon}
          alt="alexmammagay"
          className="loading-icon"
        />
      </section>
    );
  }

  return (
    <section>
      <div className="container">
          <div className="items">
            <div className="item-card-container">

              {products.map(p => (
                <ItemCard key={p.id} product={p} />
              ))}
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
  );
  
}
export default HomePage;