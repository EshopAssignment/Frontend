import { updateOrderCustomer, type OrderDto } from "@/Services/orderService";
import { useEffect, useState } from "react";


type Props = {
    orderNumber:string;
    order: OrderDto;
    onSaved:() => void
};

function PersonalForm({orderNumber, order, onSaved}: Props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState ("");
    const [phone, setPhone] = useState("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFirstName(order.customerFirstName ??  "");
        setLastName(order.customerLastName ?? "");
        setEmail(order.customerEmail ?? "");
        setPhone(order.customerPhoneNumber ?? "");
    }, [order]);
    
    const isValid=
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0;

    const alreadySaved = isValid &&
        firstName === order.customerFirstName &&
        lastName === order.customerLastName &&
        email === order.customerEmail &&
        phone === (order.customerPhoneNumber ?? "");

    async function onSubmit (e: React.FormEvent) {
        e.preventDefault();
        if(!isValid || saving ) return;

        try {
            setSaving(true);
            setError(null);

            await updateOrderCustomer(orderNumber, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phone.trim() || null,
            });

            onSaved();
        } catch (err: any){
            setError(err?.message ?? "kunde inte spara uppgifter");
        } finally {
            setSaving(false);
        }
    }


  return (
    <div>
        <div className="divider"></div>
        <form onSubmit={onSubmit} className="form personal-form">
            <h2>Personuppgifter</h2>
            <div className="input-group">
                <label htmlFor="personal-Fname">Förnamn</label>
                <input className="input" 
                type="text" 
                id="personal-Fname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={saving || alreadySaved}
                 />
            </div>
            <div className="input-group">
                <label htmlFor="personal-Lname">Efternamn</label>
                <input
                 className="input"
                 id="personal-Lname"
                 value={lastName}
                 onChange={(e) => setLastName(e.target.value)}
                 disabled={saving || alreadySaved}
                  />
            </div>
            <div className="input-group">
                <label htmlFor="personal-email">Email</label>
                <input 
                className="input"  
                id="personal-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving || alreadySaved}
                />
            </div>
            <div className="input-group">
                <label htmlFor="personal-phone">Telefon Nummer (valfritt)</label>
                <input className="input" 
                 id="personal-phone" 
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 disabled={saving || alreadySaved}
                 />
            </div>

            {error && <p className="form-error">{error}</p>}
            
            <button           
            className="btn btn-submit"
                disabled={!isValid || saving || alreadySaved}>
                {alreadySaved ? "Sparat" : saving ? "Sparar…" : "Bekräfta"}
          </button>

        </form>
    </div>
  )
}

export default PersonalForm
