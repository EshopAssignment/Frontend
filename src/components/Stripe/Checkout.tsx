import { useCart } from "@/context/CartContext";
import { createPaymentIntent } from "@/Services/paymentService";
import { getOrderByNumber, type OrderDto } from "@/Services/orderService";
import ShippingPicker from "@/components/Shipping/ShippingPicker";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PersonalForm from "../Checkout/PersonalForm";
import DeliveryForm from "../Checkout/DeliveryForm";

const pk = import.meta.env.VITE_STRIPE_PK;
if (!pk) throw new Error("VITE_STRIPE_PK saknas i .env");
const stripePromise = loadStripe(pk);

function Form({ orderNumber }: { orderNumber: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${location.origin}/order/thank-you/${orderNumber}` },
    });
    setSubmitting(false);

    if (error) console.error(error.message);
  }

  return (
    <form onSubmit={onSubmit}>
      <PaymentElement />
      <button disabled={!stripe || submitting}>
        {submitting ? "Bearbetar…" : "Betala"}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { cartId } = useCart();
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const [err, setErr] = useState<string | null>(null);

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
  const [payLoading, setPayLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!orderNumber) return;
    setErr(null);
    setOrderLoading(true);
    try{
      const o = await getOrderByNumber(orderNumber);
      console.log("[refresh normalized order]", o);
      setOrder(o)
    } catch (e:any) {
      setErr(e?.message ?? "Kunde inte hämta oroder");
    } finally {
      setOrderLoading(false)
    }
  }, [orderNumber])

  useEffect(() => {
    refresh();
  }, [refresh]);

  const customerReady = useMemo ( () => {
    if (!order) return false;
    return !!(
      order.customerFirstName?.trim() &&
      order.customerLastName?.trim() &&
      order.customerEmail?.trim()
    );
  }, [order]);

  const addressReady = useMemo (() => {
    const a = order?.shippingAddress;
    return !!(
      a?.street?.trim() &&
      a?.city?.trim() &&
      a?.postalCode?.trim() &&
      a?.country?.trim()
    );
  }, [order]);

  const postalCode = useMemo (() => {
    return order?.shippingAddress?.postalCode?.trim() ?? "";
  }, [order])

  const shippingReady = useMemo(() => {
    if (!order) return false

    if(order.shippingCarrier && order.shippingMethod) {
      return order.shippingCarrier !== "None" && order.shippingMethod !== "None"
    }

    return Number(order.shippingCost ?? 0) > 0;
  },  [order]);

  useEffect(() => {
    if (!orderNumber) return;
    if(!order) return;
    if(!customerReady || !addressReady || !shippingReady) return
    if (clientSecret) return;

    let alive = true;
    setErr(null);
    setPayLoading(true);

    createPaymentIntent(orderNumber, cartId)
    .then((r) => {
      if(!alive) return
      setClientSecret(r.clientSecret);
    })
    .catch((e) =>{
      if (!alive) return;
      setErr(e?.message ?? "Kunde inte starta betalning")
    })
    .finally(() => {
      if (!alive) return;
      setPayLoading(false)
    });

    return () => {
      alive = false;
    };
  }, [orderNumber, cartId, order, customerReady, addressReady, shippingReady, clientSecret]);

  if (!orderNumber) return <p className="container">Ordernummer saknas.</p>;
  if (err) return <p className="container">{err}</p>;
  if (orderLoading || !order) return <p className="container">Laddar order…</p>;

  return (
    <section>
      <div className="container">

        <div>Här är sammantällning av kundvagnen.</div>
        
        <PersonalForm
        orderNumber={orderNumber}
        order={order}
        onSaved={() => refresh()} />
        
        <DeliveryForm
        orderNumber={orderNumber}
        order={order}
        locked={!customerReady}
        onSaved={() => refresh()}
         />

         {!shippingReady && (
          <div>
            {!addressReady || !postalCode ? (
              <p>Fyll i leveransuppgifter (postnummer) för att välja frakt.</p>
            ) : (
              <ShippingPicker
                orderNumber={orderNumber}
                postalCode={postalCode}
                onSelectionSaved={() => refresh()}
              />
            )}
          </div>
        )}

        {shippingReady && (
          <div className="stripe-container">
            {payLoading && !clientSecret && <p>Laddar betalning…</p>}
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: "night" } }}
              >
                <Form orderNumber={orderNumber} />
              </Elements>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
