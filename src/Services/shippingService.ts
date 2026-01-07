import {api} from "@/lib/http";
import * as sdk from "@/api/sdk.gen";

export type ServicePointDto = 
    NonNullable<Awaited<ReturnType<typeof sdk.getApiShippingServicePoints>>["data"]>[number];

export type SetShippingSelectionDto = 
      Parameters<typeof sdk.putApiShippingOrdersByOrderNumberSelection>[0]["body"];

export async function getServicePoints(postalCode: string, city?: string) {
  console.log("[shippingService] getServicePoints args:", { postalCode, city });

  const res = await sdk.getApiShippingServicePoints({
    client: api,
    query: { postalCode, city },
  });

  console.log("[shippingService] response:", res);
  console.log("[shippingService] data:", res.data);
  console.log("[shippingService] error:", res.error);

  if (res.error) throw res.error;

  const data = res.data ?? [];
  if (!Array.isArray(data)) {
    console.warn("[shippingService] expected array but got:", data);
    return [];
  }

  return data;
}


export async function setShippingSelection(orderNumber:string, body: SetShippingSelectionDto) {
    const res = await sdk.putApiShippingOrdersByOrderNumberSelection({
        client: api,
        path: {orderNumber},
        body
    });
    if (res.error) throw res.error;
}