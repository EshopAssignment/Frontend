import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrderById,
  listOrders,
  updateOrderStatus,
  type AdminOrderDetails,
  type AdminOrderListItem,
  type AdminPagedOrders,
  type AdminOrderStatus,
} from "../../Services/adminOrderService";

const PAGE_SIZE = 20;

const STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Completed",
  "Refunded",
  "Failed",
  "Cancelled",
] as const;


const asNum = (v: unknown, fb = 0) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fb;
};

function fmtUtc(input: string | Date) {
  const s = typeof input === "string" ? input : input.toISOString();
  const safe = s.endsWith("Z") ? s : s + "Z";
  const d = new Date(safe);
  return isNaN(d.getTime())
    ? "-"
    : d.toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" });
}

const fmtSEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 2 }).format(n);

export default function AdminOrders() {
  const qclient = useQueryClient();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const list = useQuery<AdminPagedOrders>({
    queryKey: ["admin-orders", page, query, status],
    queryFn: () =>
      listOrders({
        page,
        pageSize: PAGE_SIZE,
        query: query || undefined,
        status: status || undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  const details = useQuery<AdminOrderDetails>({
    queryKey: ["admin-order", selectedId],
    queryFn: () => getOrderById(selectedId as number),
    enabled: selectedId !== null,
    staleTime: 10_000,
  });

  const mutStatus = useMutation({
    mutationFn: ({ id, next }: { id: number; next: AdminOrderStatus }) => updateOrderStatus(id, next),
    onMutate: async (vars) => {
      await qclient.cancelQueries({ queryKey: ["admin-orders"] });
      const prev = qclient.getQueriesData({ queryKey: ["admin-orders"] });

      prev.forEach(([key, snapshot]) => {
        const pageSnap = snapshot as AdminPagedOrders | undefined;
        if (!pageSnap) return;
        const items = (pageSnap.items ?? []).map(i =>
          i.id === vars.id ? { ...i, orderStatus: vars.next } : i
        );
        qclient.setQueryData(key, { ...pageSnap, items });
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.prev?.forEach(([key, snapshot]: any) => {
        qclient.setQueryData(key, snapshot);
      });
    },
    onSettled: () => {
      qclient.invalidateQueries({ queryKey: ["admin-orders"] });
      qclient.invalidateQueries({ queryKey: ["admin-order"] });
    },
  });

  const totalPages = asNum(list.data?.totalPages, 1) || 1;
  const items: AdminOrderListItem[] = (list.data?.items ?? []) as AdminOrderListItem[];

  return (
    <section>
      <h1 className="header-text">Ordrar</h1>

      <div className="admin-actions">
        <input
          className="filter-bar"
          placeholder="Sök ordernr, kundnamn, eller email"
          value={query}
          onChange={(e) => {
            setPage(1);
            setQuery(e.target.value);
          }}
        />
        <select
          className="input filter-picker"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
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

      {list.isLoading && <p>Laddar…</p>}
      {list.isError && <p>Kunde inte hämta ordrar.</p>}

      {list.data && (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ordernr</th>
                <th>Skapad</th>
                <th>Kund</th>
                <th>Email</th>
                <th>Status</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const id = asNum(row.id, NaN);
                const total = asNum(row.grandTotal, 0);
                return (
                  <tr key={String(row.id)}>
                    <td>{row.orderNumber}</td>
                    <td>{fmtUtc(row.createdAtUtc as unknown as string)}</td>
                    <td>{row.customerName}</td>
                    <td>{row.customerEmail}</td>
                    <td>
                    <select
                      className="input"
                      value={row.orderStatus}                         
                      onChange={(e) => {
                        if (!Number.isFinite(id)) return;
                        const next = Number(e.target.value) as AdminOrderStatus;
                        mutStatus.mutate({ id, next });
                      }}
                      disabled={!Number.isFinite(id)}
                    >
                        {STATUSES.map((s) => (
                          <option className="options" key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{fmtSEK(total)}</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => Number.isFinite(id) && setSelectedId(id)}
                        disabled={!Number.isFinite(id)}
                      >
                        Detaljer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              {"<"}
            </button>
            <span>Sida {page} av {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              {">"}
            </button>
          </div>
        </>
      )}

      {selectedId !== null && details.data && (
        <div className="modal">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-label={`Order ${details.data.orderNumber}`}>
            <div className="admin-order-details">
              <h3>Order {details.data.orderNumber}</h3>
              <p>Namn: {details.data.customerFirstName} {details.data.customerLastName}</p>
              <p>Kontakt: {details.data.customerEmail} | {details.data.customerPhoneNumber}</p>
              <p>
                Adress: {details.data.shippingStreet}, {details.data.shippingPostalCode}{" "}
                {details.data.shippingCity}, {details.data.shippingCountry}
              </p>
              <p>Status: {details.data.orderStatus}</p>
              <p>Skapad: {fmtUtc(details.data.createdAtUtc as unknown as string)}</p>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Antal</th>
                  <th>Pris</th>
                  <th>Rad</th>
                </tr>
              </thead>
              <tbody>
                {(details.data.items ?? []).map((it) => {
                  const qty = asNum(it.quantity, 0);
                  const price = asNum(it.unitPrice, 0);
                  const line = asNum(it.lineTotal, price * qty);
                  return (
                    <tr key={`${it.productId}-${it.productName}`}>
                      <td>{it.productName}</td>
                      <td>{qty}</td>
                      <td>{fmtSEK(price)}</td>
                      <td>{fmtSEK(line)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="total">
              Produkter: {fmtSEK(asNum(details.data.productsSubtotal, 0))} &nbsp;|&nbsp;
              Frakt: {fmtSEK(asNum(details.data.shippingCost, 0))} &nbsp;|&nbsp;
              Moms: {fmtSEK(asNum(details.data.taxTotal, 0))} &nbsp;|&nbsp;
              Totalt: {fmtSEK(asNum(details.data.grandTotal, 0))}
            </p>

            <div>
              <button className="btn" autoFocus onClick={() => setSelectedId(null)}>Stäng</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
