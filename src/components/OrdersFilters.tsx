import { STATUSES } from "@/helpers/orderStatus";

export function OrdersFilters(props: {
    query: string;
    status: string;
    onQueryChange: (v: string) => void;
    onStatusChange: (v: string ) => void;
}) {
    return (
        <div className="admin-actions">
            <input
            className="filter-bar"
            placeholder="Sök ordernr, kundnamn, eller email"
            value={props.query}
            onChange={(e) => { props.onQueryChange(e.target.value)}}/>

            <select
            className="input filter-picker"
            value={props.status}
            onChange={(e) => { props.onStatusChange(e.target.value)}}
           
            >
            <option className="options" value="">
                Alla statusar
            </option>
            {STATUSES.map((s) => (
                <option className="options" key={s} value={s}>
                {s}
                </option>
            ))}
            </select>
        </div>
    )
}