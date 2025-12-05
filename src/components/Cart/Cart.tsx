import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { createOrderFromCart } from "../../Services/orderService";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const {state, total, removeOne, removeAll, clear} = useCart();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const handleCheckout = async () => {
      if (state.items.length === 0 || submitting) return;
      setSubmitting(true);
      setError(null);
      setOrderNumber(null);
      try {
      const result = await createOrderFromCart(state.items);
      clear();
      navigate(`/order/thank-you/${result.orderNumber}`, {
      state: result,
      });

    } catch (err) {
      console.error(err);
      setError("Could not create order.")
    } finally {
      setSubmitting(false);
    }

  };
    return(   
        <div className="cart">
            <p>Varukorg</p>

            {state.items.length === 0 &&(
              <p>Nothing in your cart! Get to the shopping!</p>
            )}

            {state.items.length > 0 && (
            <>
              <ul>
                <li className="cart-row">
                    <span>Produkt</span>
                    <span> Antal</span>
                    <span>Pris</span>
                </li>
                {state.items.map(item => (
                  <li key={item.productId} className="cart-row">
                    <span>{item.name}</span>
                    <span>x {item.quantity}</span>
                    <span>{item.priceExVat * item.quantity} kr</span>
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

    )};

export default Cart;
