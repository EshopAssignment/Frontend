import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAddress,
  getMe,
  setDefaultShippingAddress,
  updateProfile,
  type UpdateProfileDto,
  type UpsertAddressDto,
} from "@/Services/profileService";
import { qk } from "@/queries/queryKeys";
import { findSelectedDefault, toAddressOptions, toDefaultId } from "@/helpers/profileVm";

export function useMyProfileQuery() {
  const qc = useQueryClient();

  const [saved, setSaved] = useState<string | null>(null);

  const meQuery = useQuery({
    queryKey: qk.meProfile,
    queryFn: getMe,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const me = meQuery.data ?? null;

  const [profileForm, setProfileForm] = useState<UpdateProfileDto>({
    firstName: "",
    lastName: "",
    phone: "",
    defaultShippingAddressId: null,
  });

  const [addressForm, setAddressForm] = useState<UpsertAddressDto>({
    label: "Home",
    street: "",
    city: "",
    postalCode: "",
    country: "SE",
  });

const didInitProfile = useRef(false);

useEffect(() => {
    if (!me || didInitProfile.current) return;

    setProfileForm({
      firstName: me.profile?.firstName ?? "",
      lastName: me.profile?.lastName ?? "",
      phone: me.profile?.phone ?? "",
      defaultShippingAddressId: me.profile?.defaultShippingAddressId ?? null,
    });
    

    didInitProfile.current = true;
  }, [me]);

  const addressOptions = useMemo(() => toAddressOptions(me), [me]);
  const defaultId = useMemo(() => toDefaultId(me), [me]);
  const selectedDefault = useMemo(
    () => findSelectedDefault(addressOptions, defaultId),
    [addressOptions, defaultId]
  );

const updateProfileMut = useMutation({
  mutationFn: (dto: UpdateProfileDto) => updateProfile(dto),
  onSuccess: async () => {
    setSaved("Uppgifter sparade.");
    didInitProfile.current = false;
    await qc.invalidateQueries({ queryKey: qk.meProfile });
  },
});

  const addAddressMut = useMutation({
    mutationFn: (dto: UpsertAddressDto) => addAddress(dto),
    onSuccess: async () => {
      setSaved("Adress sparad.");
      setAddressForm({
        label: "Home",
        street: "",
        city: "",
        postalCode: "",
        country: "SE",
      });
      await qc.invalidateQueries({ queryKey: qk.meProfile });
    },
  });

  const setDefaultMut = useMutation({
    mutationFn: (id: number | null) => setDefaultShippingAddress(id),
    onSuccess: async () => {
      setSaved("Standardadress uppdaterad.");
      await qc.invalidateQueries({ queryKey: qk.meProfile });
    },
  });

  const error =
    (meQuery.error as any)?.message ??
    (updateProfileMut.error as any)?.message ??
    (addAddressMut.error as any)?.message ??
    (setDefaultMut.error as any)?.message ??
    null;

  async function submitProfile() {
    setSaved(null);
    await updateProfileMut.mutateAsync(profileForm);
  }

  async function submitAddress() {
    setSaved(null);
    await addAddressMut.mutateAsync(addressForm);
  }

  async function chooseDefault(id: number | null) {
    setSaved(null);
    await setDefaultMut.mutateAsync(id);
  }

  return {
    me,

    loading: meQuery.isLoading,
    fetching: meQuery.isFetching,

    error,
    saved,
    clearSaved: () => setSaved(null),

    profileForm,
    setProfileForm,
    addressForm,
    setAddressForm,

    addressOptions,
    defaultId,
    selectedDefault,

    submitProfile,
    submitAddress,
    chooseDefault,

    savingProfile: updateProfileMut.isPending,
    savingAddress: addAddressMut.isPending,
    savingDefault: setDefaultMut.isPending,
  };


}
