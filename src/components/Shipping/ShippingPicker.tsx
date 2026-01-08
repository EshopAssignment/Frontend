import { getServicePoints, setShippingSelection } from "@/Services/shippingService";
import { useEffect, useMemo, useState } from "react";

type Props = {
    orderNumber: string;
    postalCode: string;
    city?:string;
    onSelectionSaved: () => void;
}

export default function ShippingPicker ({orderNumber, postalCode, city, onSelectionSaved}: Props){
    const [points, setPoints] = useState<any[]>(([]));
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        console.log("[ShippingPicker] props", { orderNumber, postalCode, city });
        let alive = true;
        setLoading(true);
        setErr(null);

        getServicePoints(postalCode, city)
        .then(list => {
            if (!alive) return;
            console.log("[ShippingPicker] service points result type:", typeof list, Array.isArray(list));
            console.log("[ShippingPicker] service points raw:", list);
            setPoints(list);
            })
        .catch(e => {
            if (!alive) return;
            console.error("[ShippingPicker] getServicePoints error:", e);
            setErr(e?.message ?? "Could not fetch postoffices");
            })
        .finally(() => {if (alive) setLoading(false); });

        return () => {alive = false;};
    }, [postalCode, city]);

    const shippingCost = useMemo(() => (selected ? 99 : 0), [selected]);

    async function save() {
        if (!selected) return;
        setSaving(true);
        setErr(null);

        try {
            await setShippingSelection(orderNumber, {
                carrier: "postnord",
                method: "service_point",
                shippingCost,
                servicePointId: selected,
            });
            onSelectionSaved();
        }   catch (e: any){
            setErr(e?.message ?? "Could not save delivery method");
        } finally {
            setSaving(false);
        }
    }

    if(loading) return <p className="container loading-msg">Laddar ombud...</p>
    if(err) return <span className="container error-msg">{err}</span>

    return(
        <>
            <div className="divider"></div>
            <div className="shipping-picker">
                <span>Välj ombud</span>

                {points.length === 0 && <p>Inga ombud Hittades</p>}

                <ul className="carrier-options">
                    {points.map(p => (
                    <li key={p.id}>
                        <label className="carrier-option">
                        <input
                            type="radio"
                            name="servicePoint"
                            checked={selected === p.id}
                            onChange={() => setSelected(p.id)}
                        />
                        <img src="/src/images/Postnord.png" alt="postnord" />
                        {p.name} ({p.street}, {p.postalCode} {p.city} )
                        </label>
                    </li>
                    ))}
                </ul>

                <p>Frakt: <strong>{shippingCost} kr</strong></p>

                <button className="btn btn-submit" onClick={save} disabled={!selected || saving}>
                    {saving ? "Sparar" : "Bekräfta ombud"}
                </button>
            </div>
        </>
    );
}