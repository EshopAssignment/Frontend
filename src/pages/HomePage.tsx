import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
import { getProducts, type ProductDto } from "../Services/productService";
import loadingIcon from "../images/loading.png";

const HomePage = () => {
  const [products, setProducts] = useState<ProductDto[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    getProducts()
    .then(setProducts)
    .finally(() => setLoading(false))
  }, [])


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

          </div>
          <div className="divider"></div>


      </div>
    </section>
  );
  
}
export default HomePage;