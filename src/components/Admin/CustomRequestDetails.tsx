import { fmtSEK } from "@/helpers/orderFormat";
import type { AdminCustomRequestDetails } from "@/Services/adminCustomRequestService";

type Props = {
  data: AdminCustomRequestDetails;
  onCreateQuote: () => void;
  onClose: () => void;
  onSendQuote: (quoteId: number) => void;
  sendingQuoteId: number | null;
  busy?: boolean;
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
    case "Draft":
      return "Utkast";
    case "Sent":
      return "Skickad";
    case "Accepted":
      return "Accepterad";
    case "Expired":
      return "Utgången";
    default:
      return status;
  }
}

export default function CustomRequestDetails({
  data,
  onCreateQuote,
  onClose,
  onSendQuote,
  sendingQuoteId,
  busy,
}: Props) {
  return (
    <div className="admin-card">
      <div className="admin-card-header admin-card-header--split">
        <div>
          <h2>{data.name}</h2>
          <p>{data.email}</p>
          {data.phone && <p>{data.phone}</p>}
        </div>

        <div className="admin-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Stäng
          </button>
          <button type="button" className="btn" onClick={onCreateQuote} disabled={busy}>
            Ny offert
          </button>
        </div>
      </div>

      <div className="admin-detail-stack">
        <div>
          <h3>Meddelande</h3>
          <div className="admin-message-box">{data.message}</div>
        </div>

        <div>
          <h3>Intern anteckning</h3>
          <p>{data.internalNote || "Ingen intern anteckning."}</p>
        </div>

        {data.attachmentFileName && (
          <div>
            <h3>Bilaga</h3>
            <p>{data.attachmentFileName}</p>
          </div>
        )}

        <div>
          <h3>Tidigare offerter</h3>

          {data.quotes.length === 0 ? (
            <p>Inga offerter skapade ännu.</p>
          ) : (
            <div className="admin-quote-list">
              {data.quotes.map((quote) => (
                <div key={quote.id} className="admin-quote-item">
                  <div>
                    <strong>{quote.title}</strong>
                    <p>Status: {formatStatus(quote.status)}</p>
                    <p>Skapad: {new Date(quote.createdAtUtc).toLocaleString("sv-SE")}</p>
                    {quote.sentAtUtc && (
                      <p>Skickad: {new Date(quote.sentAtUtc).toLocaleString("sv-SE")}</p>
                    )}
                    {quote.expiresAtUtc && (
                      <p>Gäller till: {new Date(quote.expiresAtUtc).toLocaleDateString("sv-SE")}</p>
                    )}
                  </div>

                  <div className="admin-quote-item__side">
                    <strong>{fmtSEK(Number(quote.totalIncVat ?? 0))}</strong>

                    {quote.status === "Draft" && (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => onSendQuote(Number(quote.id))}
                        disabled={sendingQuoteId === quote.id}
                      >
                        Skicka offert
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}