import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { createOrderFromCart } from "../../Services/orderService";
import { useNavigate } from "react-router-dom";
import placeholder from "../../Images/Placeholder.jpg";

const Cart = () => {
    const {state, cartId, totalExVat, removeOne, removeAll, clear} = useCart();
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
    const result = await createOrderFromCart(state.items, cartId);

    navigate(`/checkout/${result.orderNumber}`, {
      state: result 
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
            <table className="cart-table">
            <thead className="cart-head">
              <tr>
              <th>Produkt</th>
              <th>Antal</th>
              <th>Pris</th>
              <th>Åtgärder</th>
              </tr>
            </thead>
            <tbody className="cart-body">
              {state.items.map(item => (
              <tr key={item.productId}>
                <td className="table-img">
                <img
                className="cart-item-img"
                  src={item.imgUrl || placeholder}
                  alt={item.name}
                  onError={(e) => (e.currentTarget.src = placeholder)}
                />
                <span>{item.name}</span>
                </td>
                <td>x {item.quantity}</td>
                <td>{item.priceExVat * item.quantity} kr</td>
                <td className="btn-cart">
                <button className="btn-subtract" onClick={() => removeOne(item.productId)}>-1</button>
                <button className="btn-trash" onClick={() => removeAll(item.productId)}><i className="fa-solid fa-trash-can"></i></button>
                </td>
              </tr>
              ))}
            </tbody>
            </table>
            <button className="btn-clear" onClick={clear}>Töm varukorgen</button>

            <div className="checkout">
            <p className="cart-total">
              Totalt: {totalExVat} kr
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