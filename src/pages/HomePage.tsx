import { useEffect, useState } from "react";
import ItemPall from "../components/ItemPall";
import { getProducts, type ProductDto } from "../Services/productService";

const HomePage = () => {
  const [products, setProducts] = useState<ProductDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts()
    .then(setProducts)
    .finally(() => setLoading(false))
  }, [])
  

  if(loading) return <p>Hold on, pallets are stacking</p>

  return (
    <section>
      <div className="container">
          <div className="items">
          
          <div className="item-card-container">

              {products.map(p => (
                <ItemPall key={p.id} product={p} />
              ))}
              

          </div>

          </div>
          <div className="divider"></div>
          <div className="cart">
            <p>Här ligger mina pallar jag köper</p>
          </div>


      </div>
    </section>
  );
  
}
export default HomePage;