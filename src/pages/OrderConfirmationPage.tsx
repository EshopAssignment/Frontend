import { Link, useLocation, useParams } from "react-router-dom";
import type { OrderCreatedDto } from "../Services/orderService";

interface LocationState extends OrderCreatedDto {}

const OrderConfirmationPage = () => {
    const {orderNumber} = useParams();
    const location = useLocation();
    const state = location.state as LocationState | null;



    const total = state?.total ?? 0;
    const date = state?.orderDate ?? "";
    
  return (
    <section>
      <div className="container">
          <div className="confirmation-view">

            <div className="confirmation-content">
                <h2>Tack för din order</h2>
                <span>{orderNumber ? `Ordernummer: ${orderNumber}` : ""}</span>
                
                
                <p>
                    Totalt: <strong>{total} kr</strong>
                </p>

                <p>
                    Orderdatum: <strong>{new Date(date).toLocaleString("sv-SE")}</strong>
                </p>

                <div className="support">
                    <p>Fågor? kontakta kundtjänst här</p>
                    <p>Länk till kontaktsida här.</p>
                </div>
            </div>

            <div className="btn-return">
                <Link to="/">Fortsätt handla</Link>     
            </div>

          </div>
      </div>
    </section>
  );
  
}
export default OrderConfirmationPage;