import type { FulfillmentStatus } from "@/Services/adminFulfillmentService";

type Props = {
  query: string;
  fulfillmentStatus: FulfillmentStatus | undefined;
  overdueOnly: boolean;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: FulfillmentStatus | undefined) => void;
  onOverdueOnlyChange: (value: boolean) => void;
};

export function FulfillmentFilters({
  query,
  fulfillmentStatus,
  overdueOnly,
  onQueryChange,
  onStatusChange,
  onOverdueOnlyChange,
}: Props) {
  return (
    <div className="orders-filters">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Sök ordernummer, namn eller e-post"
        aria-label="Sök i fulfillment"
      />

      <select
        value={fulfillmentStatus ?? ""}
        onChange={(e) =>
          onStatusChange(
            e.target.value ? (e.target.value as FulfillmentStatus) : undefined
          )
        }
        aria-label="Filtrera på fulfillment-status"
      >
        <option value="">Alla statusar</option>
        <option value="Unreviewed">Unreviewed</option>
        <option value="Ready">Ready</option>
        <option value="Fulfilled">Fulfilled</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={overdueOnly}
          onChange={(e) => onOverdueOnlyChange(e.target.checked)}
        />
        Endast overdue
      </label>
    </div>
  );
}