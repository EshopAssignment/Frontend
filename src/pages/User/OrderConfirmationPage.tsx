import { Link, useParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { OrderCreatedDto } from "../../Services/orderService";
import { getOrderById } from "../../Services/orderService";

const ORDERS = {
  byId: (id: number) => ["orders", id] as const,
};

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const state: OrderCreatedDto | null = history.state?.usr ?? null;

  const id = orderNumber ? Number(orderNumber) : NaN;
  const validId = !Number.isNaN(id);

  const { data, isFetching, isError, error } = useQuery<OrderCreatedDto, Error>({
    queryKey: validId ? ORDERS.byId(id) : ["orders", "invalid"],
    enabled: validId,
    queryFn: ({ signal }) => getOrderById(id, { signal }),
    initialData: state ?? undefined,
    placeholderData: keepPreviousData,
    staleTime: 5_000
  });

  if (!validId) {
    return (
      <section>
        <div className="container">
          <div className="confirmation-view">
            <div className="confirmation-content">
              <h2>Hoppsan</h2>
              <p>Kunde inte hitta ett giltigt ordernummer.</p>
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

  const dto = data ?? state ?? undefined;
  const total = dto?.total ?? 0;
  const dateStr = dto?.orderDate ? new Date(dto.orderDate).toLocaleString("sv-SE") : "";

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
                {new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(total)}
              </strong>
              {isFetching ? " (verifierar…)" : ""}
            </p>

            <p>
              Orderdatum: <strong>{dateStr}</strong>
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
