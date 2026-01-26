import { useEffect } from "react";
import { useMyOrderDetails } from "@/queries/orders/useMyOrderDetails";
import { fmtSEK, fmtUtc, toStatusLable } from "@/helpers/orderFormat";

type Props = {
  orderNumber: string | null;
  onClose: () => void;
};

function asNum(v: any, fb = 0) {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fb;
}

export function OrderDetailsModal({ orderNumber, onClose }: Props) {
  const q = useMyOrderDetails(orderNumber);

  useEffect(() => {
    if (!orderNumber) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [orderNumber, onClose]);

  if (!orderNumber) return null;

  return (
    <div className="modal" onMouseDown={onClose}>
      <div className="modal-panel" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        {q.isLoading && <p>Laddar…</p>}
        {q.isError && <p>Kunde inte hämta orderdetaljer.</p>}

        {q.data && (
          <>
            <div className="user-order-details">
              <h3>Order {String((q.data as any).orderNumber ?? orderNumber)}</h3>

              <p>
                Namn: {String((q.data as any).customerFirstName ?? "")} {String((q.data as any).customerLastName ?? "")}
              </p>

              <p>
                Kontakt: {String((q.data as any).customerEmail ?? "-")} |{" "}
                {String((q.data as any).customerPhone ?? (q.data as any).customerPhoneNumber ?? "-")}
              </p>

              <p>
                Adress:{" "}
                {(() => {
                  const a = (q.data as any).shippingAddress;
                  if (!a) return "-";
                  return `${a.street}, ${a.postalCode} ${a.city}, ${a.country}`;
                })()}
              </p>

              <p>Status: {toStatusLable((q.data as any).orderStatus)}</p>
              <p>Skapad: {fmtUtc((q.data as any).createdAtUtc)}</p>

              {(q.data as any).trackingUrl && (
                <p style={{ marginTop: ".5rem" }}>
                  <a className="btn" href={(q.data as any).trackingUrl} target="_blank" rel="noreferrer">
                    Spåra paket
                  </a>
                </p>
              )}
            </div>

            <table className="user-table">
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Antal</th>
                  <th>Pris</th>
                  <th>Rad</th>
                </tr>
              </thead>

              <tbody>
                {(((q.data as any).items ?? []) as any[]).map((it) => {
                  const qty = asNum(it.quantity, 0);
                  const price = asNum(it.unitPrice, 0);
                  const line = asNum(it.lineTotal, price * qty);

                  return (
                    <tr key={`${it.productId}-${it.productName}`}>
                      <td>{it.productName}</td>
                      <td>{qty}</td>
                      <td>{fmtSEK(price)}</td>
                      <td>{fmtSEK(line)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="details-total">

                <p>Produkter: {fmtSEK(asNum((q.data as any).productSubtotal ?? (q.data as any).productsSubtotal, 0))}{" "}</p>

                <p>Frakt: {fmtSEK(asNum((q.data as any).shippingTotal ?? (q.data as any).shippingCost, 0))}{" "}</p>

                <p>Moms: {fmtSEK(asNum((q.data as any).taxTotal, 0))}</p>

                <span> Totalt:{" "}{fmtSEK(asNum((q.data as any).grandTotal, 0))}</span>

            </div>

            <div className="details-btn">
              <button className="btn" type="button" autoFocus onClick={onClose}>
                Stäng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
