import {api} from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type * as apiTypes from "@/api/types.gen";


export async function getServicePoints(
  postalCode: string,
  city?: string
): Promise<apiTypes.ServicePointDto[]> {
  const res = await sdk.getApiShippingServicePoints({
    client: api,
    query: { postalCode, city },
  });

  if (res.error) throw res.error;
  return res.data ?? [];
}

export async function setShippingSelection(
  orderNumber: string,
  body: apiTypes.SetShippingSelectionDto
): Promise<void> {
  const res = await sdk.putApiShippingOrdersByOrderNumberSelection({
    client: api,
    path: { orderNumber },
    body,
  });

  if (res.error) throw res.error;
}