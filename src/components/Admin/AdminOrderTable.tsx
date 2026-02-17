import { asNum } from "@/helpers/money";
import { fmtSEK, fmtUtc } from "@/helpers/orderFormat";
import { STATUS_TO_NUM, STATUSES, toStatusKey, type StatusKey } from "@/helpers/orderStataus";
import type { AdminOrderListItem, AdminOrderStatus } from "@/Services/adminOrderService";

export function AdminOrderTable(props: {
    items: AdminOrderListItem[];
    onOpenDetails: (id: number) => void;
    onChangeStatus: (id: number, next: AdminOrderStatus) => void;
    disabled?: boolean;
}) {
    return(
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Ordernr</th>
                    <th>Skapad</th>
                    <th>Kund</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {props.items.map((row: any) => {
                    const id = asNum(row.id, NaN);
                    const total = asNum(row.grandTotal, 0);
                    const statusKey = toStatusKey(row.orderStatus);

                    return (
                        <tr key={String(row.id)}>
                            <td>{row.orderNumber}</td>
                            <td>{fmtUtc(row.createdAtUtc as unknown as string)}</td>
                            <td>{row.customerName}</td>
                            <td>{row.customerEmail}</td>

                            <td>
                                <select
                                    className="input"
                                    value={statusKey}
                                    onChange={(e) => {
                                        if (!Number.isFinite(id)) return;
                                        const key = e.target.value as StatusKey;
                                        props.onChangeStatus(id, STATUS_TO_NUM[key] as unknown as AdminOrderStatus);
                                    }}
                                    disabled={props.disabled || !Number.isFinite(id)}
                                >
                                    {STATUSES.map((s) => (
                                        <option className="options" key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </td>

                            <td>{fmtSEK(total)}</td>
                            <td>
                                <button
                                    className="btn"
                                    onClick={() => Number.isFinite(id) && props.onOpenDetails(id)}
                                    disabled={!Number.isFinite(id)}
                                >
                                    Detaljer
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}
