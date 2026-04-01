import { useState } from "react";
import { asNum } from "@/helpers/money";
import {
  type AdminFulfillmentOrder,
  type FulfillmentStatus,
} from "@/Services/adminFulfillmentService";

import { Pagination } from "@/components/Admin/AdminPagination";
import { AdminFulfillmentFilters } from "@/components/Admin/AdminFulfillmentFilters";
import { AdminFulfillmentTable } from "@/components/Admin/AdminFulfillmentTable";
import { AdminFulfillmentModal } from "@/components/Admin/AdminFulfillmentModal";
import { useAdminFulfillmentDetails, useAdminFulfillmentList, useMarkFulfilled, useReopenFulfillment, useSetFulfillmentNote } from "@/hooks/useFulfillment";

export default function AdminFulfillmentPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [fulfillmentStatus, setFulfillmentStatus] = useState<FulfillmentStatus | undefined>(undefined);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const list = useAdminFulfillmentList(page, query, fulfillmentStatus, overdueOnly);
  const details = useAdminFulfillmentDetails(selectedId);

  const mutMarkFulfilled = useMarkFulfilled();
  const mutReopen = useReopenFulfillment();
  const mutSetNote = useSetFulfillmentNote();

  const totalCount = asNum(list.data?.totalCount, 0);
  const pageSize = asNum(list.data?.pageSize, 20) || 20;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const items = (list.data?.items ?? []) as AdminFulfillmentOrder[];

  return (
    <section>
      <h1 className="header-text">Fulfillment</h1>

      <AdminFulfillmentFilters
        query={query}
        fulfillmentStatus={fulfillmentStatus}
        overdueOnly={overdueOnly}
        onQueryChange={(v) => {
          setPage(1);
          setQuery(v);
        }}
        onStatusChange={(v) => {
          setPage(1);
          setFulfillmentStatus(v);
        }}
        onOverdueOnlyChange={(v) => {
          setPage(1);
          setOverdueOnly(v);
        }}
      />

      {list.isLoading && <p>Laddar fulfillment...</p>}
      {list.isError && <p>Kunde inte hämta fulfillment-kön.</p>}

      {list.data && (
        <>
          <AdminFulfillmentTable
            items={items}
            onOpenDetails={setSelectedId}
            onMarkFulfilled={(id, note) => mutMarkFulfilled.mutate({ id, note })}
            onReopen={(id, note) => mutReopen.mutate({ id, note })}
            disabled={mutMarkFulfilled.isPending || mutReopen.isPending}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </>
      )}

      {selectedId !== null && details.data && (
        <AdminFulfillmentModal
          order={details.data}
          orderId={selectedId}
          onClose={() => setSelectedId(null)}
          onSaveNote={(note) => mutSetNote.mutate({ id: selectedId, note })}
          onMarkFulfilled={(note) => mutMarkFulfilled.mutate({ id: selectedId, note })}
          onReopen={(note) => mutReopen.mutate({ id: selectedId, note })}
          saving={
            mutSetNote.isPending ||
            mutMarkFulfilled.isPending ||
            mutReopen.isPending
          }
        />
      )}
    </section>
  );
}