import { useCart } from "../../context/CartContext";
import placeholder from "../../Images/Placeholder.jpg";
import { useState } from "react";

export default function CartSummary() {

    const {state, totalExVat, removeOne, removeAll, addOne } = useCart();
    
    const [error, ] = useState<string | null>(null);
    const [orderNumber, ] = useState<string | null>(null);
    
  return (
    <div className="cart-sum">
        <p>Varukorg</p>

        {state.items.length === 0 &&(
            <p>Din varukorg är tom? du ska inte vara där.</p>
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
                    <td className="summary-quantity">
                        <button className="add" onClick={() => addOne(item.productId)}>+</button>
                            {item.quantity}
                        <button className="sub" onClick={() => removeOne(item.productId)}>-</button>
                    </td>
                    <td>{item.priceExVat * item.quantity} kr</td>
                    <td>
                        <button className="btn-trash" onClick={() => removeAll(item.productId)}><i className="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>
                ))}
                </tbody>

            </table>

            <div className="price-summary">
                <p className="cart-total">
                Totalt: {totalExVat} kr
                </p>
                <span className="moms">Varav moms:</span>
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

