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

export function FulfillmentDetailsModal({
  order,
  onClose,
  onSaveNote,
  onMarkFulfilled,
  onReopen,
  saving = false,
}: Props) {
  const [note, setNote] = useState(order.fulfillmentNote ?? "");

  useEffect(() => {
    setNote(order.fulfillmentNote ?? "");
  }, [order.fulfillmentNote, order.id]);

  const fullName =
    [order.customerFirstName, order.customerLastName].filter(Boolean).join(" ") ||
    "Okänd kund";

  const isFulfilled = String(order.fulfillmentStatus) === "Fulfilled";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fulfillment-modal-title"
      >
        <header className="admin-card-header">
          <div>
            <h2 id="fulfillment-modal-title">{order.orderNumber}</h2>
            <p>{fullName}</p>
          </div>
          <button type="button" onClick={onClose}>
            Stäng
          </button>
        </header>

        <div className="admin-modal-section">
          <p><strong>E-post:</strong> {order.customerEmail || "-"}</p>
          <p><strong>Telefon:</strong> {order.customerPhoneNumber || "-"}</p>
          <p><strong>Orderstatus:</strong> {order.orderStatus}</p>
          <p><strong>Fulfillment:</strong> {order.isOverdue ? "Overdue" : order.fulfillmentStatus}</p>
          <p><strong>Tracking:</strong> {order.trackingNumber || "-"}</p>
          <p><strong>Summa:</strong> {fmtSEK(Number(order.grandTotal ?? 0))}</p>
        </div>

        <div className="admin-modal-section">
          <label htmlFor="fulfillment-note">Intern anteckning</label>
          <textarea
            id="fulfillment-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={6}
          />
        </div>

        <footer className="admin-modal-actions">
          <button
            type="button"
            onClick={() => onSaveNote(note.trim() || null)}
            disabled={saving}
          >
            Spara anteckning
          </button>

          {!isFulfilled ? (
            <button
              type="button"
              onClick={() => onMarkFulfilled(note.trim() || null)}
              disabled={saving}
            >
              Markera som fulfilled
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onReopen(note.trim() || null)}
              disabled={saving}
            >
              Återöppna
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}