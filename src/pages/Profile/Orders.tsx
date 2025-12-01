const Help = () => {
  const tempOrders = [
  {
    date: "2025-11-26",
    orderNumber: "ORD-20251126092603892-2512",
    trackingUrl: "https://tracking.example.com/track/ORD-20251126092603892-2512",
    receiptUrl: "https://pallshoppen.example.com/receipts/19",
    status: "Pending",
    total: 900
  },
  {
    date: "2025-11-23",
    orderNumber: "ORD-20251123184312931-8931",
    trackingUrl: "https://tracking.example.com/track/ORD-20251123184312931-8931",
    receiptUrl: "https://pallshoppen.example.com/receipts/18",
    status: "Shipped",
    total: 1450
  },
  {
    date: "2025-11-18",
    orderNumber: "ORD-20251118101255732-1183",
    trackingUrl: "https://tracking.example.com/track/ORD-20251118101255732-1183",
    receiptUrl: "https://pallshoppen.example.com/receipts/17",
    status: "Delivered",
    total: 299
  },
  {
    date: "2025-11-14",
    orderNumber: "ORD-20251114153200722-0091",
    trackingUrl: "https://tracking.example.com/track/ORD-20251114153200722-0091",
    receiptUrl: "https://pallshoppen.example.com/receipts/16",
    status: "Cancelled",
    total: 1200
  }
];

  return (
    <section>
          <div>
            <table className="admin-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Ordernummer</th>
                <th>spåra</th>
                <th>kvitto</th>
                <th>status</th>
                <th>ordervärde</th>
                <th>Detalj</th>
              </tr>
            </thead>

            <tbody>
              {tempOrders.map(order => (
                <tr key={order.orderNumber}>
                  <td>{order.date}</td>
                  <td>{order.orderNumber}</td>
                  <td><a href={order.trackingUrl} target="_blank" rel="noopener noreferrer"><i className="truck fa-solid fa-truck"></i></a></td>
                  <td><a href={order.receiptUrl} target="_blank" rel="noopener noreferrer"><i className="recipt fa-solid fa-receipt"></i></a></td>
                  <td>{order.status}</td>
                  <td>{order.total}kr</td>
                  <td className="table-details">
                    <a  href="#"><i className="more fa-solid fa-ellipsis"></i></a>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </section>
  );
};

export default Help;