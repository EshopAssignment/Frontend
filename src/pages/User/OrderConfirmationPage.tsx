import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { OrderCreatedDto } from "../../Services/orderService";
import { getOrderById } from "../../Services/orderService";

const ORDERS = {
  byId: (id: number) => ["orders", id] as const,
};

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const state = (location.state as OrderCreatedDto | null) ?? null;

  const rawId = state?.orderId as unknown;
  const id =
    typeof rawId === "number"
      ? rawId
      : typeof rawId === "string"
      ? Number(rawId)
      : NaN;

  const validId = Number.isFinite(id);

const { data, isFetching, isError, error } = useQuery<OrderCreatedDto, Error, OrderCreatedDto>({
  queryKey: validId ? ORDERS.byId(id as number) : ["orders", "invalid"],
  enabled: validId,
  queryFn: ({ signal }) => getOrderById(id as number, { signal }),
  initialData: state ?? undefined,
  placeholderData: keepPreviousData,
  staleTime: 5_000,
  select: (d) => ({
    ...d,
    total: Number.isFinite(Number(d.total)) ? Number(d.total) : 0,
  }),
});


  if (!validId) {
    return (
      <section>
        <div className="container">
          <div className="confirmation-view">
            <div className="confirmation-content">
                <h2>Hoppsan något gick fel</h2>
              <div className="btn-return">
                <Link to="/products">Till produkter</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError && !data) {
    return (
      <section>
        <div className="container">
          <div className="confirmation-view">
            <div className="confirmation-content">
              <h2>Ett fel inträffade</h2>
              <p>{error?.message ?? "Kunde inte hämta ordern."}</p>
              <div className="btn-return">
                <Link to="/products">Till produkter</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }



  return (
    <section>
      <div className="container">
        <div className="confirmation-view">
          <div className="confirmation-content">
            <h2>Tack för din order</h2>
            <span>{`Ordernummer: ${orderNumber}`}</span>

            <p>
              Totalt:{" "}
              <strong>
                {data?.total} SEK
              </strong>
              {isFetching ? " (verifierar…)" : ""}
            </p>

            <p>
              Orderdatum: <strong>{data?.orderDate.toString().split('T')[0]}</strong>
            </p>

            <div className="support">
              <p>Frågor? Kontakta kundtjänst här.</p>
              <p>Länk till kontaktsida här.</p>
            </div>
          </div>

          <div className="btn-return">
            <Link to="/products">Fortsätt handla</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;
