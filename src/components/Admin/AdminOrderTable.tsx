import { OrderStatus } from "@/api";
import { asNum } from "@/helpers/money";
import { fmtUtc } from "@/helpers/orderFormat";
import type { AdminOrderListItem, AdminOrderStatus } from "@/Services/adminOrderService";

type Props = {
  items: AdminOrderListItem[];
  onOpenDetails: (id: number) => void;
  onChangeStatus: (id: number, next: AdminOrderStatus) => void;
  disabled?: boolean;
};

const STATUSES = Object.values(OrderStatus)

export function AdminOrderTable({
  items,
  onOpenDetails,
  onChangeStatus,
  disabled = false,
}: Props)
 {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Ordernr</th>
          <th>Skapad</th>
          <th>Kund</th>
          <th>E-post</th>
          <th>Status</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {items.map((row) => {
          const id = asNum(row.id, NaN);

          return (
            <tr key={row.id}>
              <td>{row.orderNumber}</td>
              <td>{fmtUtc(row.createdAtUtc)}</td>
              <td>{row.customerName}</td>
              <td>{row.customerEmail}</td>

              <td>
<select
                  className="input"
                  value={row.orderStatus}
                  onChange={(e) => {
                    if (!Number.isFinite(id)) return;
                    onChangeStatus(id, e.target.value as AdminOrderStatus);
                  }}
                  disabled={disabled || !Number.isFinite(id)}
                >
                    {STATUSES.map((status) => (
                    <option className="options" key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>

              <td>{row.grandTotal}</td>

              <td>
                <button
                  type="button"
                  className="btn"
                  onClick={() => onOpenDetails(id)}
                  disabled={disabled}
                >
                  Detaljer
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}