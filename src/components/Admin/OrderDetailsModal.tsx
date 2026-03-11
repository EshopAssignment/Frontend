import { priceIncVat, lineIncVat } from "@/helpers/money";
import { fmtUtc, fmtSEK } from "@/helpers/orderFormat";
import type { AdminOrderDetails } from "@/Services/adminOrderService";
import { useEffect, useState } from "react";

type Props = {
  order: AdminOrderDetails;
  orderId: number;
  onClose: () => void;
  onSaveTracking: (vars: {
    id: number;
    trackingNumber: string;
    markAsShipped: boolean;
  }) => void;
  saving?: boolean;
};

export function OrderDetailsModal({
  order,
  orderId,
  onClose,
  onSaveTracking,
  saving = false,
}: Props) {
  const [trackingInput, setTrackingInput] = useState("");
  const [markAsShipped, setMarkAsShipped] = useState(false);

  useEffect(() => {
    setTrackingInput(order.trackingNumber ?? "");
  }, [order.trackingNumber]);

  return (
    <div className="modal" onMouseDown={onClose}>
      <div
        className="modal-panel admin-order-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Order ${order.orderNumber}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-order-details">
          <h3>Order: {order.orderNumber}</h3>

          <div className="admin-order-info">
            <span>Kunduppgifter</span>

            <p>
              Namn: {order.customerFirstName} {order.customerLastName}
            </p>

            <p>
              Kontakt: E-post: {order.customerEmail} | Telefonnummer: {order.customerPhoneNumber}
            </p>

            <p>
              Adress: {order.shippingStreet}, {order.shippingPostalCode} {order.shippingCity},{" "}
              {order.shippingCountry}
            </p>
          </div>

          <div className="admin-order-tracking">
            <span>Orderstatus</span>
            <p>Status: {order.orderStatus}</p>
            <p>Skapad: {fmtUtc(order.createdAtUtc)}</p>
          </div>

          <div className="admin-order-shipping">
            <span>Trackingnummer</span>

            <div className="tracking-input">
              <input
                className="input"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="T.ex. JJFI1234567890"
              />

              <label>
                <input
                  type="checkbox"
                  checked={markAsShipped}
                  onChange={(e) => setMarkAsShipped(e.target.checked)}
                />
                Markera som Shipped
              </label>

              <button
                type="button"
                className="btn"
                onClick={() => {
                  const trackingNumber = trackingInput.trim();
                  if (!trackingNumber) return;

                  onSaveTracking({
                    id: orderId,
                    trackingNumber,
                    markAsShipped,
                  });
                }}
                disabled={saving || trackingInput.trim().length === 0}
              >
                Spara
              </button>

              {order.trackingUrl && (
                <a className="btn" href={order.trackingUrl} target="_blank" rel="noreferrer">
                  Spåra
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="admin-order-sum">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Antal</th>
                <th>Pris</th>
                <th>Rad</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => (
                <tr key={`${item.productId}-${item.productName}`}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{fmtSEK(priceIncVat(item.unitPriceExVat, item.vatRatePercent))}</td>
                  <td>
                    {fmtSEK(
                      lineIncVat(item.unitPriceExVat, item.vatRatePercent, item.quantity)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="details-total">
            <p>Produkter: {order.productsSubtotal}</p>
            <p>Frakt: {order.shippingCost}</p>
            <p>Moms: {order.vatTotal}</p>
            <span>Totalt: {order.grandTotal}</span>
          </div>
        </div>

        <div className="details-btn">
          <button
            type="button"
            className="admin-close-btn"
            autoFocus
            onClick={onClose}
            aria-label="Stäng"
          >
            <i className="fa-regular fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  );
}