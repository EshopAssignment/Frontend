import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type * as apiTypes from "@/api/types.gen";

export type MeDto = apiTypes.MeDto;
export type UpdateProfileDto = apiTypes.UpdateProfileDto;
export type UpsertAddressDto = apiTypes.UpsertAddressDto;
export type SetDefaultAddressDto = apiTypes.SetDefaultAddressDto;

export async function getMe(opts?: { signal?: AbortSignal }): Promise<MeDto> {
  const res = await sdk.getApiMe({
    client: api,
    signal: opts?.signal,
  });

  if (res.error) throw res.error;
  return res.data!;
}

export async function updateProfile(
  body: UpdateProfileDto,
  opts?: { signal?: AbortSignal }
): Promise<void> {
  const res = await sdk.putApiMeProfile({
    client: api,
    body,
    signal: opts?.signal,
  });

  if (res.error) throw res.error;
}

export async function addAddress(
  body: UpsertAddressDto,
  opts?: { signal?: AbortSignal }
): Promise<void> {
  const res = await sdk.postApiMeAddresses({
    client: api,
    body,
    signal: opts?.signal,
  });

  if (res.error) throw res.error;
}

export async function setDefaultShippingAddress(
  defaultShippingAddressId: number | null,
  opts?: { signal?: AbortSignal }
): Promise<void> {
  const body: SetDefaultAddressDto = { defaultShippingAddressId };

  const res = await sdk.patchApiMeProfileDefaultAddress({
    client: api,
    body,
    signal: opts?.signal,
  });

  if (res.error) throw res.error;
}

export async function addAddressAndReload(
  body: UpsertAddressDto,
  opts?: { signal?: AbortSignal }
): Promise<MeDto> {
  await addAddress(body, opts);
  return getMe(opts);
}