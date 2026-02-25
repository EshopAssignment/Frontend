import type { MyOrderListItem } from "@/Services/orderService"
import { fmtSEK, fmtUtc, toStatusLable } from "@/helpers/orderFormat"

type Props =  {
    items: MyOrderListItem []
    onDetails: (orderNumber: string) => void
};

export function OrdersTable({items, onDetails}: Props) {
    return (
        <table className="user-order-table">
            <thead>
                <tr>
                    <th className="table-desktop">Datum</th>
                    <th >Ordernummer</th>
                    <th className="table-desktop">spåra</th>
                    <th className="table-desktop">kvitto</th>
                    <th>status</th>
                    <th className="table-phone">ordervärde</th>
                    <th>Detalj</th>
                </tr>
            </thead>
            <tbody>
                {items.map((o) => (
                    <tr key={o.orderNumber}>
                        <td className="table-desktop">{fmtUtc(o.date)}</td>
                        <td className="table-order-num">{o.orderNumber}</td>
                        <td className="table-desktop">
                            {o.trackingUrl ? (
                                <a href={o.trackingUrl} target="_blank" rel="noreferrer">
                                    <i className="truck fa-solid fa-truck" />
                                </a>
                            ) : (
                                <span>-</span>
                            )}
                        </td>
                        <td className="table-desktop">
                            {o.receiptUrl ? (
                                <a href={o.receiptUrl} target="_blank" rel="noopener noreferrer">
                                    <i className="recipt fa-solid fa-receipt"></i>
                                </a>
                            ) : (
                                <span>-</span>
                            )}
                        </td>
                        <td>{toStatusLable(o.status)}</td>
                        <td className="table-phone">{fmtSEK(o.total)}</td>
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