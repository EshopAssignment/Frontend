import { useEffect, useState } from "react";
import { fmtSEK } from "@/helpers/orderFormat";
import type { AdminFulfillmentOrder } from "@/Services/adminFulfillmentService";

type Props = {
  order: AdminFulfillmentOrder;
  orderId: number;
  onClose: () => void;
  onSaveNote: (note: string | null) => void;
  onMarkFulfilled: (note: string | null) => void;
  onReopen: (note: string | null) => void;
  saving?: boolean;
};

function getFulfillmentLabel(order: AdminFulfillmentOrder) {
  return order.isOverdue ? "Overdue" : order.fulfillmentStatus;
}

function getFulfillmentBadgeClass(order: AdminFulfillmentOrder) {
  if (order.isOverdue) return "status-badge status-badge--danger";

  const status = String(order.fulfillmentStatus).toLowerCase();

  if (status === "fulfilled") return "status-badge status-badge--success";
  if (status === "ready") return "status-badge status-badge--warning";

  return "status-badge";
}

export function AdminFulfillmentModal({
  order,
  orderId,
  onClose,
  onSaveNote,
  onMarkFulfilled,
  onReopen,
  saving = false,
}: Props) {
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote(order.fulfillmentNote ?? "");
  }, [order.fulfillmentNote, orderId]);

  const isFulfilled = String(order.fulfillmentStatus) === "Fulfilled";
  const fullName =
    [order.customerFirstName, order.customerLastName].filter(Boolean).join(" ") ||
    "Okänd kund";

  return (
    <div className="modal" onMouseDown={onClose}>
      <div
        className="modal-panel admin-fulfillment-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Fulfillment ${order.orderNumber}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
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

        <div className="admin-fulfillment-details">
          <h3>Order: {order.orderNumber}</h3>

          <div className="admin-fulfillment-info">
            <span>Kunduppgifter</span>
            <p>
              Namn: {fullName}
            </p>
            <p>
              Kontakt: E-post: {order.customerEmail || "-"} | Telefonnummer:{" "}
              {order.customerPhoneNumber || "-"}
            </p>
          </div>

          <div className="admin-fulfillment-status">
            <span>Fulfillment</span>
            <p>
              Fulfillmentstatus:{" "}
              <span className={getFulfillmentBadgeClass(order)}>
                {getFulfillmentLabel(order)}
              </span>
            </p>
            <p>Orderstatus: {order.orderStatus}</p>
            <p>Skapad: {order.createdAt}</p>
            <p>Bekräftad: {order.confirmedAt || "-"}</p>
            <p>Fulfilled: {order.fulfilledAt || "-"}</p>
            <p>Trackingnummer: {order.trackingNumber || "-"}</p>
          </div>

          <div className="admin-fulfillment-totals">
            <span>Ordervärden</span>
            <p>Produkter: {fmtSEK(Number(order.productsSubtotal ?? 0))}</p>
            <p>Frakt: {fmtSEK(Number(order.shippingCost ?? 0))}</p>
            <p>Moms: {fmtSEK(Number(order.vatTotal ?? 0))}</p>
            <p>
              <strong>Totalt: {fmtSEK(Number(order.grandTotal ?? 0))}</strong>
            </p>
          </div>
        </div>

        <div className="admin-fulfillment-side">
          <div className="admin-fulfillment-note">
            <span>Intern anteckning</span>

            <textarea
              className="admin-textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={10}
              placeholder="Skriv intern anteckning för fulfillment..."
            />
          </div>

          <div className="admin-fulfillment-actions">
            <button
              type="button"
              className="btn"
              onClick={() => onSaveNote(note.trim() || null)}
              disabled={saving}
            >
              Spara anteckning
            </button>

            {!isFulfilled ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onMarkFulfilled(note.trim() || null)}
                disabled={saving}
              >
                Markera som fulfilled
              </button>
            ) : (
              <button
                type="button"
                className="btn"
                onClick={() => onReopen(note.trim() || null)}
                disabled={saving}
              >
                Återöppna
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}