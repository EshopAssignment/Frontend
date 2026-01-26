import type { MyOrderListItem } from "@/Services/orderService"
import { fmtSEK, fmtUtc, toStatusLable } from "@/helpers/orderFormat"

type Props =  {
    items: MyOrderListItem []
    onDetails: (orderNumber: string) => void
};

export function OrdersTable({items, onDetails}: Props) {
    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Datum</th>
                    <th>Ordernummer</th>
                    <th>spåra</th>
                    <th>kvitto</th>
                    <th>status</th>
                    <th>ordervärde</th>
                    <th>Detalj</th>
                </tr>
            </thead>
            <tbody>
                {items.map((o) => (
                    <tr key={o.orderNumber}>
                        <td>{fmtUtc(o.date)}</td>
                        <td>{o.orderNumber}</td>
                        <td>
                            {o.trackingUrl ? (
                                <a href={o.trackingUrl} target="_blank" rel="noreferrer">
                                    <i className="truck fa-solid fa-truck" />
                                </a>
                            ) : (
                                <span>-</span>
                            )}
                        </td>
                        <td>
                            {o.receiptUrl ? (
                                <a href={o.receiptUrl} target="_blank" rel="noopener noreferrer">
                                    <i className="recipt fa-solid fa-receipt"></i>
                                </a>
                            ) : (
                                <span>-</span>
                            )}
                        </td>
                        <td>{toStatusLable(o.status)}</td>
                        <td>{fmtSEK(o.total)}kr</td>
                        <td className="table-details">
                            <button className="btn" type="button" onClick={() => onDetails(o.orderNumber)}>
                                <i className="fa-solid fa-ellipsis"></i>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}