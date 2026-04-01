import { fmtSEK } from "@/helpers/orderFormat";
import type { AdminFulfillmentOrder } from "@/Services/adminFulfillmentService";

type Props = {
  items: AdminFulfillmentOrder[];
  onOpenDetails: (id: number) => void;
  onMarkFulfilled: (id: number, note?: string | null) => void;
  onReopen: (id: number, note?: string | null) => void;
  disabled?: boolean;
};

function getFulfillmentBadgeClass(order: AdminFulfillmentOrder) {
  if (order.isOverdue) return "status-badge status-badge--danger";

  const status = String(order.fulfillmentStatus ?? "").toLowerCase();

  if (status === "fulfilled") return "status-badge status-badge--success";
  if (status === "ready") return "status-badge status-badge--warning";

  return "status-badge";
}

export function AdminFulfillmentTable({
  items,
  onOpenDetails,
  onMarkFulfilled,
  onReopen,
  disabled = false,
}: Props) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-dash-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Kund</th>
            <th>Fulfillment</th>
            <th>Orderstatus</th>
            <th className="admin-dash-table__right">Summa</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="admin-dash-table__empty">
                Inga ordrar i fulfillment-kön.
              </td>
            </tr>
          ) : (
            items.map((order) => (
              <tr key={order.id}>
                <td>
                  <button
                    type="button"
                    className="admin-link-button"
                    onClick={() => onOpenDetails(Number(order.id!))}
                  >
                    {order.orderNumber}
                  </button>
                </td>
                <td>
                  {[order.customerFirstName, order.customerLastName]
                    .filter(Boolean)
                    .join(" ") || order.customerEmail || "Okänd kund"}
                </td>
                <td>
                  <span className={getFulfillmentBadgeClass(order)}>
                    {order.isOverdue ? "Overdue" : order.fulfillmentStatus}
                  </span>
                </td>
                <td>{order.orderStatus}</td>
                <td className="admin-dash-table__right">
                  {fmtSEK(Number(order.grandTotal ?? 0))}
                </td>
                <td>
                  {String(order.fulfillmentStatus) !== "Fulfilled" ? (
                    <button
                      type="button"
                      onClick={() => onMarkFulfilled(Number(order.id!), null)}
                      disabled={disabled}
                    >
                      Markera klar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onReopen(Number(order.id!), null)}
                      disabled={disabled}
                    >
                      Återöppna
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}