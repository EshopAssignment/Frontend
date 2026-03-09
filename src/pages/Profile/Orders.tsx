import { OrderDetailsModal } from "@/components/Orders/OrderDetailsModal";
import { OrdersTable } from "@/components/Orders/OrderTable";
import { useMyOrders } from "@/hooks/orders/useMyOrder";
import { useState } from "react";

const UserOrders = () => {
  const [selected, setSelected] = useState<string | null>(null)

  const q = useMyOrders({skip: 0, take: 50});

  if (q.isLoading) return <div>Laddar dina ordrar....</div>
  if (q.isError) return <div>hoppas, någon har rivit alla palla och du kan inte se dom :/</div>

  const orders = q.data ?? [];
  if (orders.length === 0) return <div>Har har inte handlat något ännu</div>
  
  return (
    <section>
      <OrdersTable items ={orders} onDetails={(orderNumber) => setSelected(orderNumber)} />
      <OrderDetailsModal orderNumber={selected} onClose={() => setSelected(null)} />    
    </section>
  );
};

export default UserOrders;