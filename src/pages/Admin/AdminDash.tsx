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

const rangeOptions: {value: Range; label: string}[] = [
  {value: "today", label: "Idag"},
  {value: "7d", label: "7 Dagar"},
  {value: "30d", label: "30 Dagar"},
  {value: "90d", label: "90 Dagar"},
  {value: "1y", label: "1 År"},
];
const AdminDash = () => {

  const [range, setRange] = useState<Range>("30d");

  const {data, isLoading, isError} = useAdminDashboard({range});

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
      })),
      [data]
  );

    if (isLoading) {
    return (
      <section>
        <div className="container">
          <div className="admin-group">Laddar dashboard...</div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section>
        <div className="container">
          <div className="admin-group">Kunde inte ladda dashboard.</div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container">
        <div className="admin-group">
          <div className="admin-dash-header">
            <h1>Dashboard</h1>

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
          </div>

          <div className="admin-kpi-grid">
            <article className="admin-kpi-card">
              <h2>Omsättning</h2>
              <p>{fmtSEK(Number(data.summary.revenue ?? 0))}</p>
            </article>

            <article className="admin-kpi-card">
              <h2>Ordrar</h2>
              <p>{data.summary.orderCount}</p>
            </article>

            <article className="admin-kpi-card">
              <h2>Sålda artiklar</h2>
              <p>{data.summary.unitsSold}</p>
            </article>

            <article className="admin-kpi-card">
              <h2>Snittordervärde</h2>
              <p>{fmtSEK(Number(data.summary.averageOrderValue ?? 0))}</p>
            </article>
          </div>

          <div className="admin-chart-card">
            <h2>Försäljning över tid</h2>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-chart-card">
            <h2>Mest populära produkter</h2>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="unitsSold" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-table-card">
            <h2>Senaste ordrar</h2>
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Kund</th>
                  <th>Status</th>
                  <th>Betalning</th>
                  <th>Summa</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.orderStatus}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{fmtSEK(Number(order.grandTotal ?? 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDash;
