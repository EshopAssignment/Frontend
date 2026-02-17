import { useState } from "react";
import type { AdminOrderListItem } from "../../Services/adminOrderService";
import { useAdminOrdersList } from "@/hooks/orders/useAdminOrdersList";
import { useUpdateOrderStatus } from "@/hooks/orders/useUpdateOrderStatus";
import { useAdminOrderDetails } from "@/hooks/orders/useAdminOrderDetails";
import { useSetTracking } from "@/hooks/orders/useSetTracking";
import { asNum } from "@/helpers/money";
import { OrdersFilters } from "@/components/OrdersFilters";
import { AdminOrderTable } from "@/components/Admin/AdminOrderTable";
import { OrderDetailsModal } from "@/components/Admin/OrderDetailsModal";
import { Pagination } from "@/components/Admin/AdminPagination";


export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const list = useAdminOrdersList(page, query, status);

  const details = useAdminOrderDetails(selectedId);

  const mutStatus = useUpdateOrderStatus();
  const mutTracking = useSetTracking();

  const totalPages = asNum(list.data?.totalPages, 1) || 1;
  const items = (list.data?.items ?? []) as AdminOrderListItem[];

  return (
    <section>
      <h1 className="header-text">Ordrar</h1>

      <OrdersFilters
        query={query}
        status={status}
        onQueryChange={(v) => {
          setPage(1);
          setQuery(v);
        }}
        onStatusChange={(v) => {
          setPage(1);
          setStatus(v);
        }}
      />

      {list.isLoading && <p>Laddar…</p>}
      {list.isError && <p>Kunde inte hämta ordrar.</p>}

      {list.data && (
        <>
          <AdminOrderTable
            items={items}
            onOpenDetails={setSelectedId}
            onChangeStatus={(id, next) => mutStatus.mutate({ id, next })}
            disabled={mutStatus.isPending}
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
        <OrderDetailsModal
          order={details.data}
          orderId={selectedId}
          onClose={() => setSelectedId(null)}
          onSaveTracking={(vars) => mutTracking.mutate(vars)}
          saving={mutTracking.isPending}
        />
      )}
    </section>
  );
}
