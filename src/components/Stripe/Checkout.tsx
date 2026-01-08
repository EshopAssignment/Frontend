import { useCart } from "@/context/CartContext";
import { createPaymentIntent } from "@/Services/paymentService";
import { getOrderByNumber, type OrderDto } from "@/Services/orderService";
import ShippingPicker from "@/components/Shipping/ShippingPicker";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
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

  const [shippingReady, setShippingReady] = useState(false);

  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;

    let alive = true;
    setErr(null);
    setOrderLoading(true);

    getOrderByNumber(orderNumber)
      .then((o) => {
        if (!alive) return;
        
        console.log("[Checkout] orderNumber:", orderNumber);
        console.log("[Checkout] raw order:", o);
        console.log("[Checkout] shippingAddress:", o.shippingAddress);
        console.log("[Checkout] postalCode:", o.shippingAddress?.postalCode);

        setOrder(o);

        const hasShipping = Number(o.shippingCost ?? 0) > 0;
        setShippingReady(hasShipping);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message ?? "Kunde inte hämta order.");
      })
      .finally(() => {
        if (!alive) return;
        setOrderLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [orderNumber]);

  const postalCode = order?.shippingAddress?.postalCode?.trim() ?? "";
  console.log("[Checkout] computed postalCode:", postalCode);

  useEffect(() => {
    if (!orderNumber) return;
    if (!shippingReady) return;

    let alive = true;
    setErr(null);
    setPayLoading(true);

    createPaymentIntent(orderNumber, cartId)
      .then((r) => {
        if (!alive) return;
        setClientSecret(r.clientSecret);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message ?? "Kunde inte initiera betalning.");
      })
      .finally(() => {
        if (!alive) return;
        setPayLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [orderNumber, cartId, shippingReady]);

  if (!orderNumber) return <p className="container">Ordernummer saknas.</p>;
  if (err) return <p className="container">{err}</p>;

  if (orderLoading || !order) return <p className="container">Laddar order…</p>;

  return (
    <section>
      <div className="container">

        <div>Här är sammantällning av kundvagnen.</div>
        
        <PersonalForm />
        
        <DeliveryForm />

        {!shippingReady && (
          <div>
            {!postalCode ? (
              <p>Ingen postkod på ordern.</p>
            ) : (
              <ShippingPicker
              orderNumber={orderNumber}
              postalCode={postalCode}
              onSelectionSaved={() => {
                setShippingReady(true);
              }}
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
              options={{
                clientSecret,
                appearance: { theme: "night" },
                }}
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
