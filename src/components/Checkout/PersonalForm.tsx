
function PersonalForm() {
  return (
    <div>
        <div className="divider"></div>
        <form className="form personal-form">
            <h2>Personuppgifter</h2>
            <div className="input-group">
                <label htmlFor="personal-Fname">Förnamn</label>
                <input className="input" type="text" placeholder="Förnamn" name="" id="personal-Fname" />
            </div>
            <div className="input-group">
                <label htmlFor="personal-Lname">Efternamn</label>
                <input className="input" type="text" placeholder="Efternamn" name="" id="personal-Lname" />
            </div>
            <div className="input-group">
                <label htmlFor="personal-email">Email</label>
                <input className="input" type="text" placeholder="Email" name="" id="personal-email" />
            </div>
            <div className="input-group">
                <label htmlFor="personal-phone">Telefon</label>
                <input className="input" type="text" placeholder="Telefon nummer" name="" id="personal-phone" />
            </div>

            <button className="btn btn-submit">Bekräfta</button>
        </form>
    </div>
  )
}

export default PersonalForm
