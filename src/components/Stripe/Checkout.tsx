import { useCart } from "@/context/CartContext";
import { createPaymentIntent } from "@/Services/paymentService";
import { getOrderByNumber } from "@/Services/orderService";
import ShippingPicker from "@/components/Shipping/ShippingPicker";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import PersonalForm from "../Checkout/PersonalForm";
import DeliveryForm from "../Checkout/DeliveryForm";
import CartSummary from "../Checkout/CartSummary";
import { orderQk } from "@/constants/queryKeys";
import { ShippingCarrier, ShippingMethod } from "@/api/types.gen";

const pk = import.meta.env.VITE_STRIPE_PK;
if (!pk) throw new Error("VITE_STRIPE_PK saknas i .env");

const stripePromise = loadStripe(pk);

function PaymentForm({ orderNumber }: { orderNumber: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${location.origin}/order/thank-you/${orderNumber}`,
      },
    });

    setSubmitting(false);

    if (error) {
      console.error(error.message);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || submitting}>
        {submitting ? "Bearbetar…" : "Betala"}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { cartId } = useCart();
  const queryClient = useQueryClient();
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const [err, setErr] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
  const [payLoading, setPayLoading] = useState(false);

  const orderQuery = useQuery({
    queryKey: orderNumber ? orderQk.byNumber(orderNumber) : orderQk.byNumber("missing"),
    queryFn: ({ signal }) => getOrderByNumber(orderNumber!, { signal }),
    enabled: !!orderNumber,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const order = orderQuery.data;

  const refresh = useCallback(async () => {
    if (!orderNumber) return;
    await queryClient.invalidateQueries({ queryKey: orderQk.byNumber(orderNumber) });
  }, [orderNumber, queryClient]);

  const customerReady = useMemo(() => {
    if (!order) return false;

    return !!(
      order.customerFirstName?.trim() &&
      order.customerLastName?.trim() &&
      order.customerEmail?.trim()
    );
  }, [order]);

  const addressReady = useMemo(() => {
    const address = order?.shippingAddress;

    return !!(
      address?.street?.trim() &&
      address?.city?.trim() &&
      address?.postalCode?.trim() &&
      address?.country?.trim()
    );
  }, [order]);

  const postalCode = useMemo(() => {
    return order?.shippingAddress?.postalCode?.trim() ?? "";
  }, [order]);

  const shippingReady = useMemo(() => {
    if (!order) return false;

    return (
      order.shippingCarrier !== ShippingCarrier.NONE &&
      order.shippingMethod !== ShippingMethod.NONE
    );
  }, [order]);

  useEffect(() => {
    if (!orderNumber || !order) return;
    if (!customerReady || !addressReady || !shippingReady) return;
    if (clientSecret) return;

    let alive = true;
    setErr(null);
    setPayLoading(true);

    createPaymentIntent(orderNumber, cartId)
      .then((result) => {
        if (!alive) return;
        setClientSecret(result.clientSecret);
      })
      .catch((error: unknown) => {
        if (!alive) return;

        setErr(
          error instanceof Error
            ? error.message
            : "Kunde inte starta betalning."
        );
      })
      .finally(() => {
        if (!alive) return;
        setPayLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [orderNumber, cartId, order, customerReady, addressReady, shippingReady, clientSecret]);

  if (!orderNumber) {
    return <p className="container">Ordernummer saknas.</p>;
  }

  if (err) {
    return <p className="container">{err}</p>;
  }

  if (orderQuery.isLoading) {
    return <p className="container">Laddar order…</p>;
  }

  if (orderQuery.isError || !order) {
    return <p className="container">Kunde inte hämta order.</p>;
  }

  return (
    <section>
      <div className="container">
        <CartSummary />

        <PersonalForm
          orderNumber={orderNumber}
          order={order}
          onSaved={() => void refresh()}
        />

        <DeliveryForm
          orderNumber={orderNumber}
          order={order}
          locked={!customerReady}
          onSaved={() => void refresh()}
        />

        {!shippingReady && (
          <div>
            {!addressReady || !postalCode ? (
              <p>Fyll i leveransuppgifter (postnummer) för att välja frakt.</p>
            ) : (
              <ShippingPicker
                orderNumber={orderNumber}
                postalCode={postalCode}
                onSelectionSaved={() => void refresh()}
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
                <PaymentForm orderNumber={orderNumber} />
              </Elements>
            )}
          </div>
        )}
      </div>
    </section>
  );
}