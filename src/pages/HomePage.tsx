import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
import { getProducts, type ProductDto } from "../Services/productService";
import { useCart } from "../context/CartContext";
import { CreateOrderFromCart } from "../Services/orderService";

const HomePage = () => {
  const [products, setProducts] = useState<ProductDto[]>([])
  const [loading, setLoading] = useState(true)
  const {state, total, removeOne, removeAll, clear} = useCart();
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
    .then(setProducts)
    .finally(() => setLoading(false))
  }, [])

  const handleCheckout = async () => {
    if (state.items.length === 0 || submitting) return;

    setSubmitting(true);
    setError(null);
    setOrderNumber(null);

    try {
      const result = await CreateOrderFromCart(state.items);
      setOrderNumber(result.orderNumber)
      clear();
    } catch (err) {
      console.error(err);
      setError("Could not create order.")
    } finally {
      setSubmitting(false);
    }

  };
  
  if(loading) return <p>Hold on, pallets are stacking</p>

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
                <button className="btn-checkout"
                  onClick={handleCheckout}
                  disabled={submitting}>
                  {submitting ? "Skickar order..." : <i className="fa-regular fa-credit-card"></i>}
                  </button>
              </div>

            </>
          )}

        {orderNumber && (
          <p>
            orderNumber: {orderNumber}
          </p>
        )}

        {error && <p>{error}</p>}
            
          </div>
      </div>
    </section>
  );
  
}
export default HomePage;