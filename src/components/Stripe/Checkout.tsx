import { useCart } from "@/context/CartContext";
import { createPaymentIntent } from "@/Services/paymentService";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const pk = import.meta.env.VITE_STRIPE_PK;
if (!pk) {
  throw new Error("VITE_STRIPE_PK saknas i .env");
}
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
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    let alive = true;

    createPaymentIntent(orderNumber, cartId)
      .then(r => { if (alive) setClientSecret(r.clientSecret); })
      .catch(e => { if (alive) setErr(e?.message ?? "Kunde inte initiera betalning."); });

    return () => { alive = false; };
  }, [orderNumber, cartId]);

  if (err) return <p>{err}</p>;
  if (!clientSecret) return <p className="container">Laddar betalning…</p>;

  return (
    <>
    <div className="container">
          <div>bla bla bla, detta har du beställt bla bla bla</div>  
          <div>bla bla bla här väljer du postnord eller inget alls bla bla bla</div>  
      
      
        <Elements 
          stripe={stripePromise} 
          options={{
          clientSecret,
          appearance: {
              theme: "night",
          }
          }}>
          <Form orderNumber={orderNumber!} />
        </Elements>

    </div>
    </>
  );
}
