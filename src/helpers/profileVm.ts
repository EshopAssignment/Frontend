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
    .map((a: any) => {
    const id = typeof a.id === "string" ? Number(a.id) : a.id;
        return {
            id,
            label: String(a.label ?? ""),
            street: String(a.street ?? ""),
            city: String(a.city ?? ""),
            postalCode: String(a.postalCode ?? ""),
            country: String(a.country ?? "")
        };
    })
    .filter((a) => Number.isFinite(a.id));
}

export function toDefaultId(me: MeDto | null): number | null {
    const raw: any = me?.profile?.defaultShippingAddressId ?? null;
    if (raw == null) return null
    const n = typeof raw === "string" ? Number(raw) : raw;
    return Number.isFinite(n) ? n : null;
}

export function findSelectedDefault(options: AddressVm[], defaultId: number | null) {
    if (!defaultId) return null;
    return options.find((a) => a.id === defaultId) ?? null;
}