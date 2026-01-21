import { useEffect, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrderById,
  listOrders,
  updateOrderStatus,
  setTracking,
  type AdminOrderDetails,
  type AdminOrderListItem,
  type AdminPagedOrders,
  type AdminOrderStatus,
} from "../../Services/adminOrderService";

const PAGE_SIZE = 20;

//formated with Chatgpt 5.2

const STATUS_TO_NUM = {
  Pending: 0,
  Confirmed: 1,
  Processing: 2,
  Shipped: 3,
  Completed: 4,
  Cancelled: 5,
  Failed: 6,
  Refunded: 7,
} as const;

type StatusKey = keyof typeof STATUS_TO_NUM;

const NUM_TO_STATUS: Record<number, StatusKey> = {
  0: "Pending",
  1: "Confirmed",
  2: "Processing",
  3: "Shipped",
  4: "Completed",
  5: "Cancelled",
  6: "Failed",
  7: "Refunded",
};

const STATUSES: readonly StatusKey[] = [
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
        const items = (pageSnap.items ?? []).map((i: any) =>
          i.id === vars.id ? { ...i, orderStatus: vars.next } : i
        );
        qclient.setQueryData(key, { ...pageSnap, items });
      });

      const curDetails = qclient.getQueryData(["admin-order", vars.id]) as any;
      if (curDetails) qclient.setQueryData(["admin-order", vars.id], { ...curDetails, orderStatus: vars.next });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.prev?.forEach(([key, snapshot]: any) => qclient.setQueryData(key, snapshot));
    },
    onSettled: () => {
      qclient.invalidateQueries({ queryKey: ["admin-orders"] });
      qclient.invalidateQueries({ queryKey: ["admin-order"] });
    },
  });

  const mutTracking = useMutation({
    mutationFn: (vars: { id: number; trackingNumber: string; markAsShipped: boolean }) =>
      setTracking(vars.id, {
        trackingNumber: vars.trackingNumber,
        markAsShipped: vars.markAsShipped,
      }),
    onSettled: () => {
      qclient.invalidateQueries({ queryKey: ["admin-orders"] });
      qclient.invalidateQueries({ queryKey: ["admin-order"] });
    },
  });

  const totalPages = asNum(list.data?.totalPages, 1) || 1;
  const items: AdminOrderListItem[] = (list.data?.items ?? []) as AdminOrderListItem[];

  const [trackingInput, setTrackingInput] = useState("");
  const [markAsShipped, setMarkAsShipped] = useState(true);

  useEffect(() => {
    const tn = (details.data as any)?.trackingNumber ?? "";
    setTrackingInput(String(tn ?? ""));
  }, [details.data]);

  const detailsId = selectedId ?? undefined;

  const getStatusKey = (raw: unknown): StatusKey => {
    if (typeof raw === "string" && raw in STATUS_TO_NUM) return raw as StatusKey;
    const n = asNum(raw, 0);
    return NUM_TO_STATUS[n] ?? "Pending";
  };

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
              {items.map((row: any) => {
                const id = asNum(row.id, NaN);
                const total = asNum(row.grandTotal, 0);
                const statusKey = getStatusKey(row.orderStatus);

                return (
                  <tr key={String(row.id)}>
                    <td>{row.orderNumber}</td>
                    <td>{fmtUtc(row.createdAtUtc as unknown as string)}</td>
                    <td>{row.customerName}</td>
                    <td>{row.customerEmail}</td>

                    <td>
                      <select
                        className="input"
                        value={statusKey}
                        onChange={(e) => {
                          if (!Number.isFinite(id)) return;

                          const key = e.target.value as StatusKey;
                          const nextNum = STATUS_TO_NUM[key];

                          mutStatus.mutate({ id, next: nextNum as unknown as AdminOrderStatus });
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
            <span>
              Sida {page} av {totalPages}
            </span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              {">"}
            </button>
          </div>
        </>
      )}

      {detailsId !== undefined && details.data && (
        <div className="modal" onMouseDown={() => setSelectedId(null)}>
          <div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Order ${(details.data as any).orderNumber}`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="admin-order-details">
              <h3>Order {(details.data as any).orderNumber}</h3>

              <p>
                Namn: {(details.data as any).customerFirstName} {(details.data as any).customerLastName}
              </p>
              <p>
                Kontakt: {(details.data as any).customerEmail} | {(details.data as any).customerPhoneNumber}
              </p>

              <p>
                Adress: {(details.data as any).shippingStreet}, {(details.data as any).shippingPostalCode}{" "}
                {(details.data as any).shippingCity}, {(details.data as any).shippingCountry}
              </p>

              <p>Status: {getStatusKey((details.data as any).orderStatus)}</p>
              <p>Skapad: {fmtUtc((details.data as any).createdAtUtc as unknown as string)}</p>

              <div style={{ marginTop: "1rem" }}>
                <label style={{ display: "block", marginBottom: ".25rem" }}>Trackingnummer</label>
                <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                  <input
                    className="input"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="T.ex. JJFI1234567890"
                  />

                  <label style={{ display: "flex", gap: ".35rem", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={markAsShipped}
                      onChange={(e) => setMarkAsShipped(e.target.checked)}
                    />
                    Markera som Shipped
                  </label>

                  <button
                    className="btn"
                    onClick={() => {
                      if (!detailsId) return;
                      const tn = trackingInput.trim();
                      if (!tn) return;

                      mutTracking.mutate({ id: detailsId, trackingNumber: tn, markAsShipped });
                    }}
                    disabled={mutTracking.isPending || trackingInput.trim().length === 0}
                  >
                    Spara
                  </button>

                  {(details.data as any).trackingUrl && (
                    <a
                      className="btn"
                      href={(details.data as any).trackingUrl as string}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Spåra
                    </a>
                  )}
                </div>
              </div>
            </div>

            <table className="admin-table" style={{ marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Antal</th>
                  <th>Pris</th>
                  <th>Rad</th>
                </tr>
              </thead>
              <tbody>
                {(((details.data as any).items ?? []) as any[]).map((it) => {
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

            <p className="total" style={{ marginTop: ".75rem" }}>
              Produkter: {fmtSEK(asNum((details.data as any).productsSubtotal, 0))} &nbsp;|&nbsp; Frakt:{" "}
              {fmtSEK(asNum((details.data as any).shippingCost, 0))} &nbsp;|&nbsp; Moms:{" "}
              {fmtSEK(asNum((details.data as any).taxTotal, 0))} &nbsp;|&nbsp; Totalt:{" "}
              {fmtSEK(asNum((details.data as any).grandTotal, 0))}
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button className="btn" autoFocus onClick={() => setSelectedId(null)}>
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
