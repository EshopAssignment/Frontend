import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrderById, listOrders, updateOrderStatus, type AdminOrderListItem } from "../../Services/adminOrderService";

const PAGE_SIZE = 20;
const STATUSES = ["New", "Processing", "Shipped", "Completed", "Cancelled"]; //temp statuses.




const AdminOrders = () => {
const qclient = useQueryClient();
const [page, setPage] = useState(1);
const [query, setQuery] = useState("");
const [status, setStatus] = useState("");
const [selectedId, setSelectedId] = useState<number | null>(null);

  const list = useQuery({
    queryKey: ["admin-orders", page, query, status],
    queryFn: () => listOrders({ page, pageSize: PAGE_SIZE, query: query || undefined, orderStatus: status || undefined }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

    const details = useQuery({
    queryKey: ["admin-order", selectedId],
    queryFn: () => getOrderById(selectedId!),
    enabled: selectedId !== null,
  });

    const mutStatus = useMutation({
    mutationFn: ({ id, next }: { id: number; next: string }) => updateOrderStatus(id, next),
    onSuccess: () => {
      qclient.invalidateQueries({ queryKey: ["admin-orders"] });
      qclient.invalidateQueries({ queryKey: ["admin-order"] });
    }
  });
  
  
return (
    <section>
      <h1 className="header-text">Ordrar</h1>

      <div className="admin-actions">
        <input
        className="filter-bar"
        placeholder="Sök ordernr, kundnamn, eller email"
        value={query}
        onChange={(e) => { setPage(1); setQuery(e.target.value); }}
        />
        <select className="input filter-picker" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option className="options" value="">Alla statusar</option>
          {STATUSES.map(s => <option className="options" key={s} value={s}>{s}</option>)}
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
              {list.data.items.map((o: AdminOrderListItem) => (
                <tr key={o.id}>
                  <td>{o.orderNumber}</td>
                  <td>{new Date(o.orderDate).toLocaleString()}</td>
                  <td>{o.customerName}</td>
                  <td>{o.customerEmail}</td>
                  <td>
                    <select
                    className="input"
                      value={o.orderStatus}
                      onChange={(e) => mutStatus.mutate({ id: o.id, next: e.target.value })}
                    >
                      {STATUSES.map(s => <option className="options" key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{o.total.toFixed(2)} kr</td>
                  <td>
                    <button className="btn" onClick={() => setSelectedId(o.id)}>Detaljer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{"<"}</button>
            <span>Sida {page} av {list.data.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(list.data!.totalPages, p + 1))} disabled={page === list.data.totalPages}>{">"}</button>
          </div>
        </>
      )}

      {selectedId !== null && details.data && (
        <div className="modal">
          <div className="modal-panel">
            <div className="admin-order-details">
                <h3>Order {details.data.orderNumber}</h3>
                <p> Namn:{details.data.customerFirstName} {details.data.customerLastName}</p>
                <p> Kontakt: {details.data.customerEmail} | {details.data.customerPhoneNumber}</p>
                <p> Adress: {details.data.shippingStreet}, {details.data.shippingPostalCode} {details.data.shippingCity}, {details.data.shippingCountry}</p>
                <p>Status: {details.data.orderStatus}</p>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produkt</th><th>Antal</th><th>Pris</th><th>Rad</th>
                </tr>
              </thead>
              <tbody>
                {details.data.items.map(it => (
                    <tr key={`${it.productId}-${it.productName}`}>
                    <td>{it.productName}</td>
                    <td>{it.quantity}</td>
                    <td>{it.price.toFixed(2)} kr</td>
                    <td>{it.price*it.quantity} kr</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="total">Totalsumma: {details.data.total.toFixed(2)} kr</p>

            <div>
              <button className="btn" onClick={() => setSelectedId(null)}>Stäng</button>
            </div>
          </div>
        </div>
      )}
    </section>
    );
};
export default AdminOrders