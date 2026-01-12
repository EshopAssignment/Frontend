import {api} from "@/lib/http";
import * as sdk from "@/api/sdk.gen";

import type { MeDto, UpdateProfileDto, UpsertAddressDto } from "@/api";

export async function getMe() {
    const res = await sdk.getApiMe({client: api})
    if (res.error) throw res.error
    return res.data as MeDto;
}

export async function updateProfile(body: UpdateProfileDto) {
    const res = await sdk.putApiMeProfile({
        client: api,
        body,
    });
    if (res.error) throw res.error;
    return;
}

export async function createAddress(body:UpsertAddressDto) {
    const res = await sdk.postApiMeAddresses({
        client: api,
        body
    });
    if (res.error) throw res.error;
    return;    
}

//helper for asycing added address to view.
export async function addAddressReload(body: UpsertAddressDto) {
    await createAddress(body);
    return await getMe();
}