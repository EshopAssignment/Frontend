import { useEffect, useState } from "react";
import ItemPall from "../components/ItemPall";
import { getProducts, type ProductDto } from "../Services/productService";
import { useCart } from "../context/CartContext";

const HomePage = () => {
  const [products, setProducts] = useState<ProductDto[]>([])
  const [loading, setLoading] = useState(true)
  const {state, total, removeOne, removeAll, clear} = useCart();
  

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

            {state.items.length === 0 &&(
              <p>Nothing in your cart! Get to the shopping!</p>
            )}

            {state.items.length > 0 && (
            <>
              <ul>
                {state.items.map(item => (
                  <li key={item.productId} className="cart-row">
                    <span>{item.name}</span>
                    <span>x {item.quantity}</span>
                    <span>{item.price * item.quantity} kr</span>
                    <div className="cart-btn">
                      <button className="btn-subtract" onClick={() => removeOne(item.productId)}>-1</button>
                      <button className="btn-trash" onClick={() => removeAll(item.productId)}><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  </li>
                  
                ))}
                                  

              </ul>
              <button className="btn-clear" onClick={clear}>Töm varukorgen</button>

              <div className="checkout">
                <p className="cart-total">
                  Totalt: {total} kr
                </p>
                <button className="btn-checkout"><i className="fa-regular fa-credit-card"></i></button>
              </div>

            </>
          )}
            
          </div>
      </div>
    </section>
  );
  
}
export default HomePage;