type ProfileDto = {
  firstName: string;
  lastName: string;
  phone: string;
  
};


const MyProfile = () => {
  return (
    <section>
      <h1>Profil</h1>

      <form>

        <div className="input-group">
          <label>Förnamn</label>
          <input className="input" value={form.firstName} onChange={onChange("firstName")} />
        </div>

        <div className="input-group">
          <label>Efternman</label>
          <input className="input" value={form.lastName} onChange={onChange("lastName")}/>
        </div>

        <div className="input-group">
          <label>Telefonnummer</label>
          <input className="input" value={form.phone} onChange={onChange("phone")}/>
        </div>

      </form>

    </section>
  );
};

export default MyProfile;
