import { useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import { createOrderFromCart } from "../../Services/orderService";
import { useNavigate } from "react-router-dom";
import placeholder from "../../Images/Placeholder.jpg";
import { lineIncVat, vatAmountFromEx } from "@/helpers/money";
import { resolveImageUrl } from "@/helpers/ImageHelpers";
import { fmtSEK } from "@/helpers/orderFormat";

const Cart = () => {
  const { state, cartId, removeOne, removeAll, clear } = useCart();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Record<number, boolean>>({});

  const setBusy = (productId: number, on: boolean) =>
    setBusyIds((m) => ({ ...m, [productId]: on }));

  const isBusy = (productId: number) => !!busyIds[productId];

  const totalIncVat = useMemo(
    () =>
      state.items.reduce(
        (sum, x) => sum + lineIncVat(x.priceExVat, x.vatRatePercent, x.quantity),
        0
      ),
    [state.items]
  );

  const totalVat = useMemo(
    () =>
      state.items.reduce(
        (sum, x) => sum + vatAmountFromEx(x.priceExVat, x.vatRatePercent, x.quantity),
        0
      ),
    [state.items]
  );

  async function handleCheckout() {
    if (state.items.length === 0 || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await createOrderFromCart(state.items, cartId);

      navigate(`/checkout/${result.orderNumber}`, {
        state: result,
      });
    } catch (err) {
      console.error(err);
      setError("Kunde inte skapa order.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onRemoveOne(productId: number) {
    if (isBusy(productId)) return;

    setError(null);
    setBusy(productId, true);

    try {
      await removeOne(productId);
    } catch (e) {
      setError((e as Error)?.message ?? "Kunde inte uppdatera varukorgen.");
    } finally {
      setBusy(productId, false);
    }
  }

  async function onRemoveAll(productId: number) {
    if (isBusy(productId)) return;

    setError(null);
    setBusy(productId, true);

    try {
      await removeAll(productId);
    } catch (e) {
      setError((e as Error)?.message ?? "Kunde inte uppdatera varukorgen.");
    } finally {
      setBusy(productId, false);
    }
  }

  function onClear() {
    setError(null);
    clear();
  }

  return (
    <div className="cart">
      <p>Varukorg</p>

      {state.items.length === 0 && (
        <p>Ingenting i varukorgen än. Dags att göra något åt det.</p>
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
              {state.items.map((item) => {
                const imgSrc =
                  resolveImageUrl(
                    item.thumbUrl 
                  ) || placeholder;

                const lineTotalIncVat = lineIncVat(
                  item.priceExVat,
                  item.vatRatePercent,
                  item.quantity
                );

                return (
                  <tr key={item.productId}>
                    <td className="table-img">
                      <img
                        className="cart-item-img"
                        src={imgSrc}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src = placeholder;
                        }}
                      />
                      <span>{item.name}</span>
                    </td>

                    <td>x {item.quantity}</td>
                    <td>{fmtSEK(lineTotalIncVat)}</td>

                    <td className="btn-cart">
                      <button
                        className="btn-subtract"
                        onClick={() => void onRemoveOne(item.productId)}
                        disabled={isBusy(item.productId) || submitting}
                        title={isBusy(item.productId) ? "Uppdaterar..." : "Ta bort 1"}
                      >
                        -1
                      </button>

                      <button
                        className="btn-trash"
                        onClick={() => void onRemoveAll(item.productId)}
                        disabled={isBusy(item.productId) || submitting}
                        title={isBusy(item.productId) ? "Uppdaterar..." : "Ta bort alla"}
                      >
                        <i className="fa-solid fa-trash-can" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button className="btn-clear" onClick={onClear} disabled={submitting}>
            Töm varukorgen
          </button>

          <div className="checkout">
            <p className="cart-total">Totalt: {fmtSEK(totalIncVat)}</p>
            <p>Varav moms: {fmtSEK(totalVat)}</p>

            <button className="btn-checkout" onClick={handleCheckout} disabled={submitting}>
              {submitting ? "Skickar order..." : <i className="fa-regular fa-credit-card" />}
            </button>
          </div>
        </>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};

export default Cart;