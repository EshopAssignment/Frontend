import { asNum } from "@/helpers/money";
import { fmtUtc, fmtSEK } from "@/helpers/orderFormat";
import { toStatusKey } from "@/helpers/orderStataus";
import type { AdminOrderDetails } from "@/Services/adminOrderService";
import { useEffect, useState } from "react";

export function OrderDetailsModal(props: {
  order: AdminOrderDetails;
  orderId: number;
  onClose: () => void;
  onSaveTracking: (vars: { id: number; trackingNumber: string; markAsShipped: boolean }) => void;
  saving?: boolean;
}) {
    const o: any = props.order;

    const [trackingInput, setTrackingInput] = useState("");
    const [markAsShipped, setMarkAsShipped] = useState(false);

    useEffect(() => {
        setTrackingInput(String(o?.trackingNumber ?? ""));
    }, [o?.trackingNumber]);

    return (
     <div className="modal" onMouseDown={props.onClose}>
      <div
        className="modal-panel admin-order-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Order ${o.orderNumber}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-order-details">
            <h3>Order: {o.orderNumber}</h3>

            <div className="admin-order-info">
                <span>Kunduppgifter</span>
                <p>
                    Namn: {o.customerFirstName} {o.customerLastName}
                </p>
                <p>
                    Kontakt: Epost: {o.customerEmail} | Telefonnummer: {o.customerPhoneNumber}
                </p>

                <p>
                    Adress: {o.shippingStreet}, {o.shippingPostalCode} {o.shippingCity}, {o.shippingCountry}
                </p>                
            </div>
                
            <div className="admin-order-tracking">
                <span>Orderstatus</span>
                <p>Status: {toStatusKey(o.orderStatus)}</p>
                <p>Skapad: {fmtUtc(o.createdAtUtc as unknown as string)}</p>
            </div>

            <div className="admin-order-shipping">
                <span>Trackingnummer</span>
                <div className="tracking-input">
                    <input
                        className="input"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="T.ex. JJFI1234567890"
                    />

                    <label >
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
                        const tn = trackingInput.trim();
                        if (!tn) return;
                        props.onSaveTracking({ id: props.orderId, trackingNumber: tn, markAsShipped });
                        }}
                        disabled={props.saving || trackingInput.trim().length === 0}
                    >
                        Spara
                    </button>

                    {o.trackingUrl && (
                        <a className="btn" href={o.trackingUrl as string} target="_blank" rel="noreferrer">
                        Spåra
                        </a>
                    )}
                </div>
            </div>
         </div>
            
        <div className="admin-order-sum">

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
                {((o.items ?? []) as any[]).map((it) => {
                const qty = asNum(it.quantity, 0);

                const unitEx = asNum(it.unitPriceExVat ?? it.UnitPriceExVat ?? it.unitPrice ?? it.UnitPrice, 0);
                const unitInc = asNum(it.unitPriceIncVat ?? it.UnitPriceIncVat, NaN);

                const lineEx = asNum(
                    it.lineTotalExVat ?? it.LineTotalExVat ?? it.lineTotal ?? it.LineTotal,
                    unitEx * qty
                );
                const lineInc = asNum(it.lineTotalIncVat ?? it.LineTotalIncVat, NaN);

                const vatRate = asNum(it.vatRatePercent ?? it.VatRatePercent, 25);
                const computedUnitInc = unitEx * (1 + vatRate / 100);
                const computedLineInc = lineEx * (1 + vatRate / 100);

                const displayUnit = Number.isFinite(unitInc) ? unitInc : computedUnitInc;
                const displayLine = Number.isFinite(lineInc) ? lineInc : computedLineInc;

                return (
                    <tr key={`${it.productId}-${it.productName}`}>
                    <td>{it.productName}</td>
                    <td>{qty}</td>
                    <td>{fmtSEK(displayUnit)}</td>
                    <td>{fmtSEK(displayLine)}</td>
                    </tr>
                );
                })}
            </tbody>
            </table>

            <div className="details-total">
            <p>Produkter: {fmtSEK(asNum(o.productSubtotal ?? o.productsSubtotal, 0))}</p>
            <p>Frakt: {fmtSEK(asNum(o.shippingTotal ?? o.shippingCost, 0))}</p>
            <p>Moms: {fmtSEK(asNum(o.vatTotal, 0))}</p>
            <span>Totalt: {fmtSEK(asNum(o.grandTotal, 0))}</span>
            </div>

        </div>

        <div className="details-btn">
          <button className="admin-close-btn" autoFocus onClick={props.onClose} aria-label="close">
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  );
}