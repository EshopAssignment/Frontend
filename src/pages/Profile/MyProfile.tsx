import {useCallback, useEffect, useMemo, useState} from "react";
import {getMe, updateProfile, addAddress, setDefaultShippingAddress, type MeDto, type UpdateProfileDto, type UpsertAddressDto} from "@/Services/profileService";

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

  const addressess = me?.profile?.addresses ?? [];
  const defaultId = me?.profile?.defaultShippingAddressId ?? null;

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
    <section>
      <h1>Profil</h1>

      {error && <p className="error-msg">{error}</p>}
      {saved && <p className="success-msg">{saved}</p>}
      
      <div>
        <form onSubmit={submitProfile}></form>
        <form onSubmit={submitAddress}></form>
      </div>

    </section>
  );
};

export default MyProfile;
