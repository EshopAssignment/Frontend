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
import toast from "react-hot-toast";
import { toFieldErrors } from "@/lib/FieldErrors";

type FieldErrors = Record<string, string>;

type ProfileFormVm = Omit<UpdateProfileDto, "phone"> & { phone: string };

export function useMyProfileQuery() {
  const qc = useQueryClient();

  const meQuery = useQuery({
    queryKey: qk.meProfile,
    queryFn: getMe,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const me = meQuery.data ?? null;

  const [profileErrors, setProfileErrors] = useState<FieldErrors>({});
  const [addressErrors, setAddressErrors] = useState<FieldErrors>({});

  const [profileForm, setProfileForm] = useState<ProfileFormVm>({
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

  function setProfileField<K extends keyof ProfileFormVm>(key: K, value: ProfileFormVm[K]) {
    setProfileForm((p) => ({ ...p, [key]: value }));
    setProfileErrors((e) => {
      const copy = { ...e };
      delete copy[String(key)];
      return copy;
    });
  }

  function setAddressField<K extends keyof UpsertAddressDto>(key: K, value: UpsertAddressDto[K]) {
    setAddressForm((a) => ({ ...a, [key]: value }));
    setAddressErrors((e) => {
      const copy = { ...e };
      delete copy[String(key)];
      return copy;
    });
  }

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
      didInitProfile.current = false;
      await qc.invalidateQueries({ queryKey: qk.meProfile });
    },
  });

  const addAddressMut = useMutation({
    mutationFn: (dto: UpsertAddressDto) => addAddress(dto),
    onSuccess: async () => {
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
      await qc.invalidateQueries({ queryKey: qk.meProfile });
    },
  });

  async function submitProfile() {
    setProfileErrors({});

    const dto: UpdateProfileDto = {
      ...profileForm,
      phone: profileForm.phone.trim() === "" ? null : profileForm.phone.trim(),
    };

    try {
      await updateProfileMut.mutateAsync(dto);
      toast.success("Uppgifter sparade.");
    } catch (e) {
      const fe = toFieldErrors(e);
      if (fe) setProfileErrors(fe);
      toast.error("Något gick fel");
      throw e;
    }
  }

  async function submitAddress() {
    setAddressErrors({});

    try {
      await addAddressMut.mutateAsync(addressForm);
      toast.success("Adress sparad.");
    } catch (e) {
      const fe = toFieldErrors(e);
      if (fe) setAddressErrors(fe);
      toast.error("Något gick fel");
      throw e;
    }
  }

  async function chooseDefault(id: number | null) {
    try {
      await setDefaultMut.mutateAsync(id);
      toast.success("Standardadress uppdaterad.");
    } catch (e) {
      toast.error("Något gick fel");
      
      throw e;
    }
  }

  const error =
    (meQuery.error as any)?.message ??
    (updateProfileMut.error as any)?.message ??
    (addAddressMut.error as any)?.message ??
    (setDefaultMut.error as any)?.message ??
    null;

  return {
    me,

    loading: meQuery.isLoading,
    fetching: meQuery.isFetching,

    error,

    profileForm,
    setProfileField,
    profileErrors,

    addressForm,
    setAddressField,
    addressErrors,

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
