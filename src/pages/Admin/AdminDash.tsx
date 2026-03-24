import { fmtSEK } from "@/helpers/orderFormat";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Range = "today" | "7d" | "30d" | "90d" | "1y";

const rangeOptions: { value: Range; label: string }[] = [
  { value: "today", label: "Idag" },
  { value: "7d", label: "7 dagar" },
  { value: "30d", label: "30 dagar" },
  { value: "90d", label: "90 dagar" },
  { value: "1y", label: "1 år" },
];

function formatRangeLabel(range: Range) {
  switch (range) {
    case "today":
      return "idag";
    case "7d":
      return "de senaste 7 dagarna";
    case "30d":
      return "de senaste 30 dagarna";
    case "90d":
      return "de senaste 90 dagarna";
    case "1y":
      return "det senaste året";
    default:
      return "vald period";
  }
}

function getOrderStatusClass(status: string) {
  const s = status.toLowerCase();

  if (s === "completed" || s === "confirmed" || s === "shipped") {
    return "status-badge status-badge--success";
  }

  if (s === "processing" || s === "pending") {
    return "status-badge status-badge--warning";
  }

  if (s === "cancelled" || s === "failed" || s === "refunded") {
    return "status-badge status-badge--danger";
  }

  return "status-badge";
}

function getPaymentStatusClass(status: string) {
  const s = status.toLowerCase();

  if (s === "authorized" || s === "captured") {
    return "status-badge status-badge--success";
  }

  if (s === "pending") {
    return "status-badge status-badge--warning";
  }

  if (s === "failed" || s === "refunded") {
    return "status-badge status-badge--danger";
  }

  return "status-badge";
}

const AdminDash = () => {
  const [range, setRange] = useState<Range>("30d");
  const { data, isLoading, isError } = useAdminDashboard({ range });

  const revenueData = useMemo(
    () =>
      (data?.revenueSeries ?? []).map((x) => ({
        label: x.label,
        revenue: Number(x.revenue ?? 0),
        orders: Number(x.orders ?? 0),
        unitsSold: Number(x.unitsSold ?? 0),
      })),
    [data]
  );

  const topProductsData = useMemo(
    () =>
      (data?.topProductsByUnits ?? []).map((x) => ({
        name: x.productName,
        unitsSold: Number(x.unitsSold ?? 0),
        revenue: Number(x.revenue ?? 0),
      })),
    [data]
  );

  if (isLoading) {
    return (
      <section className="admin-dash">
        <div className="admin-group">
          <div className="admin-dash-state-card">
            <h1>Dashboard</h1>
            <p>Laddar dashboard...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="admin-dash">
        <div className="admin-group">
          <div className="admin-dash-state-card admin-dash-state-card--error">
            <h1>Dashboard</h1>
            <p>Kunde inte ladda dashboard.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-dash">
      <div className="admin-group">
        <header className="admin-dash-header">
          <div className="admin-dash-header__content">
            <p className="admin-dash-eyebrow">Adminpanel</p>
            <h1>Dashboard</h1>
            <p className="admin-dash-subtitle">
              Översikt för {formatRangeLabel(range)}.
            </p>
          </div>

          <div className="admin-dash-filters">
            <label htmlFor="dash-range">Period</label>
            <select
              id="dash-range"
              value={range}
              onChange={(e) => setRange(e.target.value as Range)}
            >
              {rangeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="admin-kpi-grid">
          <article className="admin-kpi-card">
            <span className="admin-kpi-card__label">Omsättning</span>
            <strong className="admin-kpi-card__value">
              {fmtSEK(Number(data.summary.revenue ?? 0))}
            </strong>
            <p className="admin-kpi-card__meta">Total försäljning i vald period</p>
          </article>

          <article className="admin-kpi-card">
            <span className="admin-kpi-card__label">Ordrar</span>
            <strong className="admin-kpi-card__value">
              {data.summary.orderCount}
            </strong>
            <p className="admin-kpi-card__meta">Antal genomförda ordrar</p>
          </article>

          <article className="admin-kpi-card">
            <span className="admin-kpi-card__label">Sålda artiklar</span>
            <strong className="admin-kpi-card__value">
              {data.summary.unitsSold}
            </strong>
            <p className="admin-kpi-card__meta">Summerat antal sålda enheter</p>
          </article>

          <article className="admin-kpi-card">
            <span className="admin-kpi-card__label">Snittordervärde</span>
            <strong className="admin-kpi-card__value">
              {fmtSEK(Number(data.summary.averageOrderValue ?? 0))}
            </strong>
            <p className="admin-kpi-card__meta">Genomsnittlig ordersumma</p>
          </article>
        </div>

        <div className="dashboard-grid">
          <article className="admin-chart-card admin-chart-card--wide">
            <div className="admin-card-header">
              <div>
                <h2>Försäljning över tid</h2>
                <p>Omsättning, ordervolym och rörelse i perioden.</p>
              </div>
            </div>

            <div className="admin-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius8)",
                      boxShadow: "var(--shadow-lg)",
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--chart-1)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="admin-chart-card">
            <div className="admin-card-header">
              <div>
                <h2>Mest populära produkter</h2>
                <p>Topp 10 baserat på antal sålda enheter.</p>
              </div>
            </div>

            <div className="admin-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProductsData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis hide dataKey="name" />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <Tooltip
                    formatter={(value) => [value, "Sålda enheter"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.name ?? "Produkt"
                    }
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius8)",
                      boxShadow: "var(--shadow-lg)",
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Bar
                    dataKey="unitsSold"
                    fill="var(--chart-2)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ul className="admin-top-products-list" aria-label="Mest populära produkter">
              {topProductsData.slice(0, 5).map((product, index) => (
                <li key={`${product.name}-${index}`} className="admin-top-products-item">
                  <span className="admin-top-products-rank">{index + 1}</span>
                  <span className="admin-top-products-name" title={product.name}>
                    {product.name}
                  </span>
                  <span className="admin-top-products-units">
                    {product.unitsSold} st
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="admin-table-card admin-table-card--full">
            <div className="admin-card-header">
              <div>
                <h2>Senaste ordrar</h2>
                <p>Snabb överblick över de senaste inkomna ordrarna.</p>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-dash-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Kund</th>
                    <th>Status</th>
                    <th>Betalning</th>
                    <th className="admin-dash-table__right">Summa</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="admin-dash-table__empty">
                        Inga ordrar att visa för vald period.
                      </td>
                    </tr>
                  ) : (
                    data.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="admin-dash-table__order">
                          <span>{order.orderNumber}</span>
                        </td>
                        <td>{order.customerName || "Okänd kund"}</td>
                        <td>
                          <span className={getOrderStatusClass(order.orderStatus)}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>
                          <span className={getPaymentStatusClass(order.paymentStatus)}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="admin-dash-table__right">
                          {fmtSEK(Number(order.grandTotal ?? 0))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AdminDash;