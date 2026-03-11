import { OrderStatus } from "@/api/types.gen";

const STATUSES = Object.values(OrderStatus);

type Props = {
  query: string;
  status: string;
  onQueryChange: (v: string) => void;
  onStatusChange: (v: string) => void;
};

export function OrdersFilters({
  query,
  status,
  onQueryChange,
  onStatusChange,
}: Props) {
  return (
    <div className="admin-actions">
      <input
        className="filter-bar"
        placeholder="Sök ordernr, kundnamn eller e-post"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      <select
        className="input filter-picker"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
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
  );
}