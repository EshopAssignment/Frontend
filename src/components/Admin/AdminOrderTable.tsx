import { fmtUtc } from "@/helpers/orderFormat";
import { STATUS_TO_NUM, STATUSES, toStatusKey, type StatusKey } from "@/helpers/orderStatus";
import type { AdminOrderListItem, AdminOrderStatus } from "@/Services/adminOrderService";

type Props = {
  items: AdminOrderListItem[];
  onOpenDetails: (id: number) => void;
  onChangeStatus: (id: number, next: AdminOrderStatus) => void;
  disabled?: boolean;
};

export function AdminOrderTable({
  items,
  onOpenDetails,
  onChangeStatus,
  disabled = false,
}: Props) {
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
          const statusKey = toStatusKey(row.orderStatus);

          return (
            <tr key={row.id}>
              <td>{row.orderNumber}</td>
              <td>{fmtUtc(row.createdAtUtc)}</td>
              <td>{row.customerName}</td>
              <td>{row.customerEmail}</td>

              <td>
                <select
                  className="input"
                  value={statusKey}
                  onChange={(e) => {
                    const key = e.target.value as StatusKey;
                    onChangeStatus(row.id, STATUS_TO_NUM[key] as AdminOrderStatus);
                  }}
                  disabled={disabled}
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
                  onClick={() => onOpenDetails(row.id)}
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