import { updateOrderShippingAddress} from "@/Services/orderService";
import React, { useEffect, useMemo, useState } from "react";
import type { OrderDetailsDto } from "@/api";


type Props = {
    orderNumber:string;
    order: OrderDetailsDto;
    locked?: boolean;
    onSaved:() => void;
}

function normPostalCode(x: string) {
      return x.replace(/\s+/g, "").trim();
}
function DeliveryForm( { orderNumber, order, locked= false, onSaved}: Props) {
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("SE");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setStreet(order.shippingAddress?.street ?? "");
        setCity(order.shippingAddress?.city ?? "");
        setPostalCode(order.shippingAddress?.postalCode ?? "");
        setCountry(order.shippingAddress?.country ?? "SE");
    }, [order]);

    const isValid = useMemo(() => {
        if (locked) return false;
        return (
        street.trim().length > 0 &&
        normPostalCode(postalCode).length > 0 &&
        city.trim().length > 0 &&
        country.trim().length > 0
        );
    }, [street, postalCode, city, country, locked]);

    const alreadySaved = useMemo(() => {
    const o = order.shippingAddress;

    if (!o) return false;
      return (
      street === (o.street ?? "") &&
      normPostalCode(postalCode) === normPostalCode(o.postalCode ?? "") &&
      city === (o.city ?? "") &&
      (country || "SE") === (o.country ?? "SE")
    );
  }, [order.shippingAddress, street, postalCode, city, country]);

  async function onSubmit(e:React.FormEvent) {
    e.preventDefault();
    if (!isValid  || saving) return;

    try{
        setSaving(true);
        setError(null);

        await updateOrderShippingAddress(orderNumber, {
            street: street.trim(),
            city: city.trim(),
            postalCode: normPostalCode(postalCode),
            country:country.trim().toUpperCase() || "SE",
        });

        onSaved();
    } catch (err: any) {
        setError(err?.message ?? "Kunde inte spara leveransuppgifter")
    } finally {
        setSaving(false);
    }
  }

  const disabled = locked || saving || alreadySaved;


  return (
    
    <div>
        <div className="divider"></div>
        <form onSubmit={onSubmit} className="form personal-form">
            <h2>Leveransuppgifter</h2>
            <div className="input-group">
                <label htmlFor="personal-street">Gata</label>
                <input
                className="input"
                onChange={(e) => setStreet(e.target.value)}
                value={street}
                disabled={disabled}
                id="personal-street" />
            </div>
            <div className="input-group">
                <label htmlFor="personal-postcode">Post nummer</label>
                <input
                className="input"
                onChange={(e) => setPostalCode(e.target.value)}
                value={postalCode}
                id="personal-postcode" 
                disabled={disabled} />
            

            </div>
            <div className="input-group">
                <label htmlFor="personal-city">Ort</label>
                <input 
                className="input" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                id="personal-city"
                disabled={disabled}

                     />
            </div>
            <div className="input-group">
                <label htmlFor="personal-country">Land</label>
                <input
                 className="input"
                onChange={(e) => setCountry(e.target.value)}
                value={country}
                disabled={disabled}
                id="personal-country"
                      />
            </div>

            {error && <p className="form-error">{error}</p>}
            <button className="btn btn-submit" disabled={!isValid || saving || alreadySaved || locked}>
                {locked ? "Fyll i Personupgifter" : alreadySaved ? "Sparat" : saving ? "Sparar…" : "Bekräfta"}
            </button>
        </form>
    </div>
  )
}
    
export default DeliveryForm
