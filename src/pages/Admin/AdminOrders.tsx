import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrderById,
  listOrders,
  updateOrderStatus,
  type AdminOrderDetails,
  type AdminOrderListItem,
  type AdminPagedOrders,
} from "../../Services/adminOrderService";

const PAGE_SIZE = 20;
const STATUSES = ["New", "Processing", "Shipped", "Completed", "Cancelled"];

const asNum = (v: unknown, fb = 0) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fb;
};

type NextStatus = Parameters<typeof updateOrderStatus>[1];

const AdminOrders = () => {
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
    mutationFn: ({ id, next }: { id: number; next: NextStatus }) =>
      updateOrderStatus(id, next),
    onSuccess: () => {
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
                <th>Datum</th>
                <th>Kund</th>
                <th>Email</th>
                <th>Status</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => {
                const id = asNum(o.id, NaN);
                const total = asNum(o.total, 0);
                const orderDate = new Date(o.orderDate as unknown as string).toLocaleString("sv-SE");
                return (
                  <tr key={String(o.id)}>
                    <td>{o.orderNumber}</td>
                    <td>{orderDate}</td>
                    <td>{o.customerName}</td>
                    <td>{o.customerEmail}</td>
                    <td>
                      <select
                        className="input"
                        value={o.orderStatus}
                        onChange={(e) =>
                          Number.isFinite(id) &&
                          mutStatus.mutate({ id, next: e.target.value as NextStatus })
                        }
                        disabled={!Number.isFinite(id)}
                      >
                        {STATUSES.map((s) => (
                          <option className="options" key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {new Intl.NumberFormat("sv-SE", {
                        style: "currency",
                        currency: "SEK",
                      }).format(total)}
                    </td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => setSelectedId(id)}
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
          <div className="modal-panel">
            <div className="admin-order-details">
              <h3>Order {details.data.orderNumber}</h3>
              <p>Namn: {details.data.customerFirstName} {details.data.customerLastName}</p>
              <p>Kontakt: {details.data.customerEmail} | {details.data.customerPhoneNumber}</p>
              <p>
                Adress: {details.data.shippingStreet}, {details.data.shippingPostalCode}{" "}
                {details.data.shippingCity}, {details.data.shippingCountry}
              </p>
              <p>Status: {details.data.orderStatus}</p>
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
                  const price = asNum(it.price, 0);
                  return (
                    <tr key={`${it.productId}-${it.productName}`}>
                      <td>{it.productName}</td>
                      <td>{qty}</td>
                      <td>
                        {new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(price)}
                      </td>
                      <td>
                        {new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(price * qty)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="total">
              Totalsumma:{" "}
              {new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(
                asNum(details.data.total, 0)
              )}
            </p>

            <div>
              <button className="btn" onClick={() => setSelectedId(null)}>Stäng</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminOrders;
