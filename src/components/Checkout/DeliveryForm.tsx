
function DeliveryForm() {
  return (
    
    <div>
        <div className="divider"></div>
        <form className="form personal-form">
            <h2>Leveransuppgifter</h2>
            <div className="input-group">
                <label htmlFor="personal-street">Gata</label>
                <input className="input" type="text" placeholder="Gata" name="" id="personal-street" />
            </div>
            <div className="input-group">
                <label htmlFor="personal-postcode">Post nummer</label>
                <input className="input" type="text" placeholder="Post nummer" name="" id="personal-postcode" />
            </div>
            <div className="input-group">
                <label htmlFor="personal-city">Ort</label>
                <input className="input" type="text" placeholder="Ort" name="" id="personal-city" />
            </div>
            <div className="input-group">
                <label htmlFor="personal-country">Land</label>
                <input className="input" type="text" placeholder="Land" name="" id="personal-country" />
            </div>
            <button className="btn btn-submit">Bekräfta</button>
        </form>
    </div>
  )
}

export default DeliveryForm
