import type { AdminCustomRequestListItem } from "@/Services/adminCustomRequestService";

type Props = {
  data: AdminCustomRequestListItem[];
  selectedId: number | null;
  page: number;
  totalPages: number;
  onSelect: (id: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

function formatStatus(status: string) {
  switch (status) {
    case "New":
      return "Ny";
    case "Reviewed":
      return "Granskad";
    case "Quoted":
      return "Offererad";
    case "Closed":
      return "Stängd";
    case "Rejected":
      return "Avvisad";
    default:
      return status;
  }
}

export default function CustomRequestTable({
  data,
  selectedId,
  page,
  totalPages,
  onSelect,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2>Inkorg</h2>
      </div>

      {data.length === 0 ? (
        <p>Inga förfrågningar hittades.</p>
      ) : (
        <div className="custom-request-list">
          {data.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`custom-request-list__item ${selectedId === item.id ? "is-active" : ""}`}
              onClick={() => onSelect(Number(item.id))}
            >
              <div className="custom-request-list__top">
                <strong>{item.name}</strong>
                <span>{formatStatus(item.status)}</span>
              </div>

              <div className="custom-request-list__meta">
                <span>{item.email}</span>
                {item.phone && <span>{item.phone}</span>}
              </div>

              <div className="custom-request-list__bottom">
                <span>{new Date(item.updatedAtUtc).toLocaleString("sv-SE")}</span>
                {item.hasAttachment && <span>Bilaga</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="admin-pager">
        <button type="button" className="btn btn-secondary" onClick={onPrev} disabled={page <= 1}>
          Föregående
        </button>
        <span>
          Sida {page} / {totalPages}
        </span>
        <button type="button" className="btn btn-secondary" onClick={onNext} disabled={page >= totalPages}>
          Nästa
        </button>
      </div>
    </div>
  );
}