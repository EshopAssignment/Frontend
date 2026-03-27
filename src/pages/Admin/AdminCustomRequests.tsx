import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  useAdminCustomRequest,
  useAdminCustomRequestMutations,
  useAdminCustomRequestsList,
} from "@/hooks/useAdminCustomRequests";

import CustomRequestTable from "@/components/Admin/CustomRequestTable";
import CustomRequestDetails from "@/components/Admin/CustomRequestDetails";
import CustomQuoteForm from "@/components/Admin/CustomQuoteForm";

const PAGE_SIZE = 20;

export default function AdminCustomRequests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [creatingQuote, setCreatingQuote] = useState(false);

  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const query = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";
  const selectedId = Number(searchParams.get("selectedId") ?? "0") || null;

  const listParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      query: query || undefined,
      status: status || undefined,
    }),
    [page, query, status]
  );

  const list = useAdminCustomRequestsList(listParams);
  const details = useAdminCustomRequest(selectedId);
  const { createQuoteMut, sendQuoteMut, busy } = useAdminCustomRequestMutations(selectedId);

  function setPage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  }

  function setQuery(nextQuery: string) {
    const next = new URLSearchParams(searchParams);
    if (nextQuery.trim()) next.set("q", nextQuery.trim());
    else next.delete("q");
    next.set("page", "1");
    setSearchParams(next);
  }

  function setStatus(nextStatus: string) {
    const next = new URLSearchParams(searchParams);
    if (nextStatus.trim()) next.set("status", nextStatus.trim());
    else next.delete("status");
    next.set("page", "1");
    setSearchParams(next);
  }

  function setSelectedId(id: number) {
    const next = new URLSearchParams(searchParams);
    next.set("selectedId", String(id));
    setSearchParams(next);
  }

  function clearSelected() {
    const next = new URLSearchParams(searchParams);
    next.delete("selectedId");
    setSearchParams(next);
    setCreatingQuote(false);
  }

  const totalPages = Math.max(1, Number(list.data?.totalPages ?? 1));

  return (
    <section>
      <div className="container">
        <div className="admin-custom-layout">
          <div className="admin-custom-toolbar">
            <div>
              <h1 className="header-text">Specialförfrågningar</h1>
              <p className="admin-page-subtext">
                Hantera inkomna kundförfrågningar och skapa offerter.
              </p>
            </div>

            <div className="admin-custom-filters">
              <input
                className="admin-input"
                type="search"
                placeholder="Sök namn, mail, telefon..."
                defaultValue={query}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setQuery((e.target as HTMLInputElement).value);
                  }
                }}
              />

              <select
                className="admin-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Alla statusar</option>
                <option value="New">Ny</option>
                <option value="Reviewed">Granskad</option>
                <option value="Quoted">Offererad</option>
                <option value="Closed">Stängd</option>
                <option value="Rejected">Avvisad</option>
              </select>
            </div>
          </div>

          <div className="admin-custom-grid">
            <div className="admin-custom-list">
              {list.isLoading && <p>Laddar förfrågningar…</p>}
              {list.isError && <p>Kunde inte hämta förfrågningar.</p>}

              {list.data && (
                <CustomRequestTable
                  data={list.data.items ?? []}
                  selectedId={selectedId}
                  page={page}
                  totalPages={totalPages}
                  onSelect={setSelectedId}
                  onPrev={() => setPage(Math.max(1, page - 1))}
                  onNext={() => setPage(Math.min(totalPages, page + 1))}
                />
              )}
            </div>

            <div className="admin-custom-details">
              {!selectedId && (
                <div className="admin-empty-state">
                  <h2>Välj en förfrågan</h2>
                  <p>Här visas detaljer, tidigare offerter och möjlighet att skapa en ny offert.</p>
                </div>
              )}

              {selectedId && details.isLoading && <p>Laddar detaljer…</p>}
              {selectedId && details.isError && <p>Kunde inte hämta detaljer.</p>}

              {details.data && (
                <>
                  <CustomRequestDetails
                    data={details.data}
                    onCreateQuote={() => setCreatingQuote(true)}
                    onClose={clearSelected}
                    onSendQuote={(quoteId) => sendQuoteMut.mutate(quoteId)}
                    sendingQuoteId={sendQuoteMut.isPending ? -1 : null}
                    busy={busy}
                  />

                  {creatingQuote && (
                    <CustomQuoteForm
                      onCancel={() => setCreatingQuote(false)}
                      onSubmit={(body) => {
                        createQuoteMut.mutate(
                          { customRequestId: (Number(details.data.id)), body },
                          {
                            onSuccess: () => setCreatingQuote(false),
                          }
                        );
                      }}
                      loading={createQuoteMut.isPending}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}