import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { OrderCreatedDto } from "../../Services/orderService";
import { getOrderById, getOrderByNumber } from "../../Services/orderService";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const state = (location.state as OrderCreatedDto | null) ?? null;
  const [sp] = useSearchParams();
  const redirectStatus = sp.get("redirect_status");
  const { clear } = useCart();

  const rawId = state?.orderId as unknown;
  const id =
    typeof rawId === "number" ? rawId
    : typeof rawId === "string" ? Number(rawId)
    : NaN;

  const hasId = Number.isFinite(id);
  const hasNumber = !!orderNumber;

  const { data, isFetching, isError, error } = useQuery<OrderCreatedDto>({
    queryKey: hasId ? ["orders","byId", id] : ["orders","byNumber", orderNumber],
    enabled: hasId || hasNumber,
    queryFn: ({ signal }) =>
      hasId
        ? getOrderById(id as number, { signal })
        : getOrderByNumber(orderNumber!, { signal }),
    initialData: state ?? undefined,
    placeholderData: keepPreviousData,
    staleTime: 5_000,
    select: (d: any) => ({
      ...d,
      grandTotal: Number(d.grandTotal ?? 0),
      createdAtUtc: d.createdAtUtc ?? d.createdAt ?? d.orderDate ?? null
    }),
  });


  useEffect(() => {
  const ok =
    redirectStatus === "succeeded" &&
    data &&
    (
      String(data.paymentStatus ?? data.paymentStatus ?? "").toLowerCase() === "authorized" ||
      String(data.orderStatus ?? "").toLowerCase() === "confirmed" ||
      true
    );

  if (!ok) return;

  const key = `cart-cleared:${data.orderNumber ?? orderNumber}`;
  if (!sessionStorage.getItem(key)) {
    clear();
    sessionStorage.setItem(key, "1");
  }
}, [redirectStatus, data?.orderNumber, data?.paymentStatus, data?.orderStatus, clear, orderNumber]);

  if (!(hasId || hasNumber)) {
    return (
      <section>
        <div className="container">
          <div className="confirmation-view">
            <div className="confirmation-content">
              <h2>Hoppsan något gick fel</h2>
              <div className="btn-return"><Link to="/products">Till produkter</Link></div>
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
              <div className="btn-return"><Link to="/products">Till produkter</Link></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const orderDate = data?.createdAtUtc ? new Date(data.createdAtUtc) : null;
  const dateText = orderDate ? orderDate.toLocaleDateString() : "-";

  return (
    <section>
      <div className="container">
        <div className="confirmation-view">
          <div className="confirmation-content">
            <h2>Tack för din order</h2>
            <span>{`Ordernummer: ${orderNumber ?? data?.orderNumber ?? "-"}`}</span>

            <p>
              Totalt: <strong>{data?.grandTotal} SEK</strong>
              {isFetching ? " (verifierar…)" : ""}
            </p>

            <p>
              varav Moms: {data?.vatTotal} SEK
              {isFetching ? " (verifierar…)" : ""}
            </p>

            <p>Orderdatum: <strong>{dateText}</strong></p>

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
