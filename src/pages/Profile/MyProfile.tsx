import {useCallback, useEffect, useMemo, useState} from "react";
import {getMe, updateProfile, addAddress, setDefaultShippingAddress, type MeDto, type UpdateProfileDto, type UpsertAddressDto} from "@/Services/profileService";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";


type AddressVm = {
  id: number;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

const MyProfile = () => {
  const [me, setMe] = useState<MeDto | null>(null);

  const [profileForm, setProfileForm] = useState<UpdateProfileDto>({
    firstName: "",
    lastName: "",
    phone: "",
    defaultShippingAddressId: null,
  });
  
  const [addressForm, setAddressForm] = useState<UpsertAddressDto>({
    label: "Home",
    street:"",
    city:"",
    postalCode:"",
    country:"SE",
  });



  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingDefault, setSavingDefault] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const addressesRaw: any[] = (me as any)?.profile?.addresses ?? [];
  const defaultIdRaw: any = (me as any)?.profile?.defaultShippingAddressId ?? null;


    const addressOptions: AddressVm[] = useMemo(() => {
    return addressesRaw
      .map((a) => {
        const id = typeof a.id === "string" ? Number(a.id) : a.id;
        return {
          id,
          label: String(a.label ?? ""),
          street: String(a.street ?? ""),
          city: String(a.city ?? ""),
          postalCode: String(a.postalCode ?? ""),
          country: String(a.country ?? ""),
        };
      })
      .filter((a) => Number.isFinite(a.id));
  }, [addressesRaw]);

  const defaultId: number | null = useMemo(() => {
    if (defaultIdRaw == null) return null;
    const n = typeof defaultIdRaw === "string" ? Number(defaultIdRaw) : defaultIdRaw;
    return Number.isFinite(n) ? n : null;
  }, [defaultIdRaw]);

  const selectedDefault = useMemo(() => {
    if (!defaultId) return null;
    return addressOptions.find((a) => a.id === defaultId) ?? null;
  }, [defaultId, addressOptions]);

  const load = useCallback(async () => {

  const data = await getMe();
  setMe(data);

    setProfileForm({
      firstName:data?.profile?.firstName ?? "",
      lastName:data?.profile?.lastName ?? "",
      phone:data?.profile?.phone ?? "",
      defaultShippingAddressId:data?.profile?.defaultShippingAddressId ?? null,
    });
  }, []);

  useEffect(() => {
    let ignore =false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setSaved(null);

        await load();
        if (ignore) return;
      } catch (e: any) {
        if(!ignore) setError(e?.message ?? "kunde inte hämta profil");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [load]);

  const submitProfile = async(e: React.FormEvent) => {
    e.preventDefault();
    if (savingProfile) return;

    try {
      setSavingProfile(true);
      setError(null);
      setSaved(null);
      
      await updateProfile(profileForm);
      setSaved("uppfigter sparade");
      await load();
    } catch (e:any) {
      setError(e?.message ?? "kunde inte uppdatera uppgifter");
    } finally {
      setSavingProfile(false);
    }
  };

  const submitAddress = async(e: React.FormEvent) => {
    e.preventDefault();
    if (savingAddress) return;

    try {
      setSavingAddress(true);
      setError(null);
      setSaved(null);

      await addAddress(addressForm);
      await load();

      setAddressForm({
        label:"Home",
        street:"",
        city:"",
        postalCode:"",
        country:"SE"
      });

      setSaved("address sparad")
    } catch (e:any) {
      setError(e?.message ?? "kunde inte spara address")
    } finally{
      setSavingAddress(false);
    }
  };

  const chooseDefault = async (id: number | null) => {
    if (savingDefault) return;

      try {
      setSavingDefault(true);
      setError(null);
      setSaved(null);

      await setDefaultShippingAddress(id);
      setSaved("Adress uppdaterad.");
      await load()
    } catch (e:any) {
      setError(e?.message ?? "kunde inte uppdaeta")
    } finally{
      setSavingDefault(false);
    }
  };



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

        <form className="user-form" onSubmit={submitProfile}>

          <h2>Användaruppgifter</h2>

          <div className="input-group">
            <label  htmlFor="">Förnamn</label>
            <input value={profileForm.firstName}             
            onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
            placeholder="Förnamn" 
            className="input" type="text" />
          </div>

          <div className="input-group">
            <label htmlFor="">Efternamn</label>
            <input value={profileForm.lastName}             
            onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
            placeholder="Efternamn" 
            className="input" type="text" />
          </div>

          <div className="input-group">
            <label htmlFor="">Telefon Nummer</label>
            <input value={profileForm.phone}             
            onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
            placeholder="Telefonnummer" 
            className="input" type="text" />
          </div>
          
          <button type="submit" disabled={savingProfile} className="btn-submit">{savingProfile ? "Sparar..." : "Spara Uppgifter!"}</button>

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
                    {addressOptions.map((a) => {
                      return (
                        <ListboxOption key={a.id} value={a} className="listbox-option">
                          <div className="flex-row standard-address">
                            <div className="">
                              <strong>{a.label}</strong>{" "}
                              <span>{a.street}, {a.postalCode} {a.city} ({a.country})</span>
                            </div>
                            <div>
                              {defaultId === a.id &&
                                <div className="arrow-icon">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                  </svg>
                                  <span> Standard Adress</span>
                                </div>}
                            </div>
                          </div>
                        </ListboxOption>
                      );
                    })}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>
          )}
          <form className="user-form" onSubmit={submitAddress}>
            <h2>Adressuppgifter</h2>

            <div className="input-group">
              <label htmlFor="">Gata</label>
              <input value={addressForm.street}           
              onChange={(e) => setAddressForm((a) => ({ ...a, street: e.target.value }))}
              placeholder="Gata" 
              className="input" type="text" />
            </div>
            
            <div className="input-group">
              <label htmlFor="">Stad</label>
              <input value={addressForm.city} 
              onChange={(e) => setAddressForm((a) => ({ ...a, city: e.target.value }))}
              placeholder="Stad" 
              className="input" type="text" />
            </div>

            <div className="input-group">
              <label htmlFor="">Postnummer</label>
              <input value={addressForm.postalCode}            
              onChange={(e) => setAddressForm((a) => ({ ...a, postalCode: e.target.value }))}
              placeholder="Postkod" 
              className="input" type="text" />
            </div>

            <button type="submit" disabled={savingAddress} className="btn-submit">{savingAddress ? "Sparar..." : "Spara Adress!"}</button>

          </form>


        </div>

      </div>

    </section>
  );
};

export default MyProfile;
