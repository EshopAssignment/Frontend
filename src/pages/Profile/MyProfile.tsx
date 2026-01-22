import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useMyProfileQuery } from "@/hooks/useMyProfileQuery";

const MyProfile = () => {
  const {
    loading,
    error,
    saved,

    profileForm,
    setProfileForm,
    savingProfile,
    submitProfile,

    addressForm,
    setAddressForm,
    savingAddress,
    submitAddress,

    addressOptions,
    defaultId,
    selectedDefault,
    savingDefault,
    chooseDefault,
  } = useMyProfileQuery();

  if (loading) return <section><div>Laddar...</div></section>;

  return (
    <section className="my-profile">
      <h1 className="my-profile-head">Profil</h1>
      <div className="divider"></div>

      <div className="status-group">
        {error && <p className="error">{error}</p>}
        {saved && <p className="success">{saved}</p>}
      </div>

      <div className="profile-forms">
        <form
          className="user-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!savingProfile) submitProfile();
          }}
        >
          <h2>Användaruppgifter</h2>

          <div className="input-group">
            <label>Förnamn</label>
            <input
              value={profileForm.firstName}
              onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
              placeholder="Förnamn"
              className="input"
              type="text"
            />
          </div>

          <div className="input-group">
            <label>Efternamn</label>
            <input
              value={profileForm.lastName}
              onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
              placeholder="Efternamn"
              className="input"
              type="text"
            />
          </div>

          <div className="input-group">
            <label>Telefon Nummer</label>
            <input
              value={profileForm.phone}
              onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="Telefonnummer"
              className="input"
              type="text"
            />
          </div>

          <button type="submit" disabled={savingProfile} className="btn-submit">
            {savingProfile ? "Sparar..." : "Spara Uppgifter!"}
          </button>
        </form>

        <div className="divider"></div>

        <div className="user-address">
          {addressOptions.length === 0 && <p>Inga adresser ännu.</p>}

          {addressOptions.length > 0 && (
            <div className="input-group">
              <label>Standardadress</label>

              <Listbox
                value={selectedDefault}
                onChange={(opt) => chooseDefault(opt?.id ?? null)}
                disabled={savingDefault}
              >
                <div className="relative listbox">
                  <ListboxButton className="input">
                    {selectedDefault
                      ? `${selectedDefault.label} (${selectedDefault.street}, ${selectedDefault.postalCode} ${selectedDefault.city})`
                      : "Välj standardadress"}
                    <ChevronDownIcon
                      className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                      aria-hidden="true"
                    />
                  </ListboxButton>

                  <ListboxOptions className="listbox-options">
                    {addressOptions.map((a) => (
                      <ListboxOption key={a.id} value={a} className="listbox-option">
                        <div className="flex-row standard-address">
                          <div>
                            <strong>{a.label}</strong>{" "}
                            <span>{a.street}, {a.postalCode} {a.city} ({a.country})</span>
                          </div>

                          {defaultId === a.id && (
                            <div className="arrow-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                              </svg>
                              <span> Standard Adress</span>
                            </div>
                          )}
                        </div>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>
          )}

          <form
            className="user-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!savingAddress) submitAddress();
            }}
          >
            <h2>Adressuppgifter</h2>

            <div className="input-group">
              <label>Gata</label>
              <input
                value={addressForm.street}
                onChange={(e) => setAddressForm((a) => ({ ...a, street: e.target.value }))}
                placeholder="Gata"
                className="input"
                type="text"
              />
            </div>

            <div className="input-group">
              <label>Stad</label>
              <input
                value={addressForm.city}
                onChange={(e) => setAddressForm((a) => ({ ...a, city: e.target.value }))}
                placeholder="Stad"
                className="input"
                type="text"
              />
            </div>

            <div className="input-group">
              <label>Postnummer</label>
              <input
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm((a) => ({ ...a, postalCode: e.target.value }))}
                placeholder="Postkod"
                className="input"
                type="text"
              />
            </div>

            <button type="submit" disabled={savingAddress} className="btn-submit">
              {savingAddress ? "Sparar..." : "Spara Adress!"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
