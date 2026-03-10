import type { MeDto } from "@/Services/profileService";

export type AddressVm = {
    id: number;
    label: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

export function toAddressOptions(me: MeDto | null): AddressVm[] {
    const raw = me?.profile?.addresses ?? [];
    return raw
    .map((a) => ({
        id: Number(a.id),
        label: a.label ?? "",
        street: a.street ?? "",
        city: a.city ?? "",
        postalCode: a.postalCode ?? "",
        country: a.country ?? "",
    }))
    .filter((a) => Number.isFinite(a.id));
    }

export function toDefaultId(me: MeDto | null):string | number | null {
  return me?.profile?.defaultShippingAddressId ?? null;
}

export function findSelectedDefault(options: AddressVm[], defaultId: number | null) {
    if (!defaultId) return null;
    return options.find((a) => a.id === defaultId) ?? null;
}