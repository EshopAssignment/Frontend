import { getMyOrders } from "@/Services/orderService";
import { useQuery } from "@tanstack/react-query";

const Help = () => {
  const { data, isLoading, isError} = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrders(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading orders.</div>;
  }

  const orders = data ?? [];

    if (orders.length === 0 ) {
      return <div> Du har inte handlat något än</div>;
    }
  

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
              {orders.map(order => (
                <tr key={order.orderNumber}>
                  <td>{order.date}</td>
                  <td>{order.orderNumber}</td>
                
                <td>
                  {order.trackingUrl ? (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="truck fa-solid fa-truck"></i>
                    </a>
                  ) : (
                    <span>-</span>
                  )}
                </td>

                <td>
                  {order.receiptUrl ? (
                    <a
                      href={order.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="recipt fa-solid fa-receipt"></i>
                    </a>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                
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