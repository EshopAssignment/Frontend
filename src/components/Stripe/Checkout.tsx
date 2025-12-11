import { useCart } from "@/context/CartContext";
import { createPaymentIntent } from "@/Services/paymentService";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

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

export default function Checkout({ orderNumber }: { orderNumber: string }) {
  const { cartId } = useCart();
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    createPaymentIntent(orderNumber, cartId).then(r => {
      if (alive) setClientSecret(r.clientSecret);
    });
    return () => { alive = false; };
  }, [orderNumber, cartId]);

  if (!clientSecret) return <p>Laddar betalning…</p>;

  return (
      <Elements 
        stripe={stripePromise} 
        options={{
        clientSecret,
        appearance: {
            theme: "night",
        }
        }}>
  
      <Form orderNumber={orderNumber} />
    </Elements>
  );
}
